const express = require("express");
// path = require('path'),
// morgan = require('morgan'),
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser());

// importing routes
const livreRoutes = require("./route/router");

// settings
app.set("port", process.env.PORT || 3000);
// app.set('views', path.join(__dirname, 'views'));
app.set("view engine", "ejs");

// routes
app.use("/", livreRoutes);

// starting the server
app.listen(app.get("port"), () => {
  console.log(`server on port ${app.get("port")}`);
});
