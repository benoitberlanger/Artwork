const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");

require("dotenv").config({ path: "./config/.env" });
require("./config/db.js");
const { checkUser, requireAuth } = require("./middleware/auth.middleware");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//jwt
app.get("*", checkUser);
app.get("/jwtid", requireAuth, (req, res) => {
  res.status(200).send(res.locals._id);
});
//routes
app.use("/api/user", userRoutes);
app.use("/api/post", postRoutes);

//server
app.listen(process.env.PORT, () => {
  console.log(`listening port ${process.env.PORT}`);
});
