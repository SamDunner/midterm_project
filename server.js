"use strict";

require('dotenv').config();

const PORT         = process.env.PORT || 8080;
const ENV          = process.env.ENV || "development";
const express      = require("express");
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
const sass         = require("node-sass-middleware");
const app          = express();


const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);

const usersRoutes = require("./routes/users");

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));
app.use(cookieParser());

// Users JSON api
app.use("/api/users", usersRoutes(knex));




app.get("/", (req, res) => {
  knex("users")
  .insert({})
  .returning("ID")
  .then((results) => {
    res.render("home", {username: req.cookies[username]});
  }
});

//log-in & log-out
app.post("/login", (req, res) => {
  knex("users")
  .select("ID")
  .where({username: req.body.username,
          password: req.body.password})
  .then((results) => {
    if (results.length === 1) {
      res.cookie("ID", results[0].id);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/logout", (req, res) => {
  res.clearCookie("ID", "/login")
  res.redirect("/");
});

//creates new map
app.post("/maps", (req, res) => {
  console.log("/maps")
  knex("maps")
  .insert({})
  .returning("ID")
  .then((results) => {
    const id = results[0];
    res.redirect(`/maps/${id}/`);
  });
});

//gives map a name TODO: put name above map
app.put("/maps/:id/name", (req, res) => {
  knex("maps")
  .where("ID", req.params.id)
  .update({name: req.body.name})
  .then((results) => {
    res.end();
  });
});

//edit map
app.get("/maps/:id", (req, res) => {
  res.render("create_new_map");
});

app.get("/maps/:id/data", (req, res) => {
  res.json({});
});


// Profile page
app.get("/user/:userId", (req, res) => {
  res.render(req.params);
});

app.get("/user/:userId/list", (req, res) => {
  res.render("edit");
});

app.get("/user/:userId/create", (req, res) => {
  res.render("edit");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});


app.post("/maps/:map_id/data_points", (req, res) => {
  console.log(req.body)
  var data_point = req.body;
  data_point.map_id = req.params.map_id;
  knex("data_points")
  .insert(data_point)
  .returning("ID")
  .then((results) => {
    res.json(results);
  });
});


