const express = require("express");
const app = express();

// dotenv
require("dotenv").config();

const PORT = process.env.PORT || 4000;

//body parser
const BodyParser = require("body-parser");
app.use(BodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(BodyParser.json({ extended: true, limit: "50mb" }));

// express-session
app.use(
  require("express-session")({
    secret: process.env.SessionSecret,
    resave: true,
    saveUninitialized: true,
    cookie: { expires: 172800000 },
  })
);

// templating
app.set("view engine", "ejs");
app.use(express.static("public"));

//mongoose
const mongoose = require("mongoose");
mongoose.set("strictQuery", true);
mongoose.set("runValidators", true);
mongoose
  .connect(process.env.mongoUri)
  .then(() => {
    console.log("db connected");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

//run server
app.listen(PORT, () => console.log(`http://localhost:${PORT}`));
