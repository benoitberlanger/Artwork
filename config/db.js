const mongoose = require("mongoose");

mongoose
  .connect(
    "mongodb+srv://" +
      process.env.DB_USER_PASS +
      "@cluster0.xmgingu.mongodb.net/Artwork",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to Mongodb"))
  .catch((err) => console.log("Failed to Connect to Mongodb", err));
