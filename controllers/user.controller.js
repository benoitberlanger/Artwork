const UserModel = require("../models/user.model");
const { ObjectID } = require("bson");

module.exports.getAllUsers = async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json(users);
};

module.exports.userInfo = (req, res) => {
  console.log(req.params);
  if (!ObjectID.isValid(req.params.id))
    return res.status(400).send(`ID unknow :` + req.params.id);

  UserModel.findById(req.params.id, (err, docs) => {
    if (!err) res.send(docs);
    else console.log("ID unknow:" + err);
  }).select("-password");
};

module.exports.updateUser = async (req, res) => {
  const { id: _id } = req.params;
  const bio = req.body.bio;

  if (!ObjectID.isValid(_id)) return res.status(400).send("ID unknown");

  try {
    await UserModel.findOneAndUpdate(
      { _id },
      {
        $set: { bio },
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    return res.status(200).json("L'utilisateur a bien été mis à jour");
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
module.exports.deleteUser = async (req, res) => {
  const { id: _id } = req.params;

  if (!ObjectID.isValid(_id)) return res.status(400).send("ID unknown");
  try {
    UserModel.deleteOne({ _id: req.params.id }).exec();
    res.status(200).json({ message: "Succesfully Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.follow = (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToFollow)
  )
    return res.status(400).send("ID unknown");

  try {
    UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $addToSet: { following: req.body.idToFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.idToFollow,
      {
        $addToSet: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err) => {
        //if (!err) res.status(201).json(docs);
        //if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};

module.exports.unfollow = async (req, res) => {
  if (
    !ObjectID.isValid(req.params.id) ||
    !ObjectID.isValid(req.body.idToUnFollow)
  )
    return res.status(400).send("ID unknown");

  try {
    UserModel.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { following: req.body.idToUnFollow },
      },
      { new: true, upsert: true },
      (err, docs) => {
        if (!err) res.status(201).json(docs);
        else return res.status(400).json(err);
      }
    );
    UserModel.findByIdAndUpdate(
      req.body.idToUnFollow,
      {
        $pull: { followers: req.params.id },
      },
      { new: true, upsert: true },
      (err) => {
        //if (!err) res.status(201).json(docs);
        if (err) return res.status(400).json(err);
      }
    );
  } catch (err) {
    return res.status(500).json({ message: err });
  }
};
