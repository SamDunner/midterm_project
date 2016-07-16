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


const getUserName = function(req, cb) {
  if (req.cookies["ID"]) {
    knex("users")
    .select('name')
    .where('ID', req.cookies['ID'])
    .then((results) => {
    // debug;
      if (results.length === 0) {
        console.log("no results found in database")
      } else {//have some results
        console.log(results)
        cb(results[0].name);
      }
    });
  } else {
    cb();
  }
}

app.get("/", (req, res) => {
  getUserName(req, (name) => {
    if (name) {
      res.render("create", {user: {name: name}});
    } else {
      res.render("home", {user: null});
    }
  })
});

//log-in & log-out
app.post("/register", (req, res) => {
  knex("users")
  .insert({name: req.body.name,
          password: req.body.password})
  .returning("ID")
  .then((results) => {
    if (results.length === 1) {
      res.cookie("ID", results[0]);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});


app.post("/login", (req, res) => {
  knex("users")
  .select("ID")
  .where({name: req.body.name,
          password: req.body.password})
  .then((results) => {
    if (results.length === 1) {
      res.cookie("ID", results[0].ID);
      res.redirect("/");
    } else {
      res.redirect("/");
    }
  });
});

app.post("/logout", (req, res) => {
  console.log("test");
  res.clearCookie("ID");
  res.redirect("/");
});

//creates new map
app.post("/maps", (req, res) => {
  knex("maps")
  .insert({user_id: req.cookies['ID']})
  .returning("ID")
  .then((results) => {
    const id = results[0];
    res.redirect(`/maps/${id}/`);
  });
});

//delete map
app.delete("/maps/:id", (req, res) => {
  knex("maps")
  .where("ID", req.params.id)
  .delete()
  .then((results) => {
      res.redirect("/");
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
  getUserName(req, (name) => {
    if (name) {
      res.render("create_new_map", {user: {name: name}});
    } else {
      res.render("home", {user: null});
    }
  });
});

app.get("/maps/:id/data", (req, res) => {
  res.json({});
});


// User Profile page NEEDS FIXING
app.get("/maps", (req, res) => {
    res.render("maps_list");
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

app.get("/maps/:map_id/data_points", (req, res) => {
  knex("data_points")
  .select("*")
  .where("map_id", req.params.map_id)
  .then((results) => {
    res.json(results);
  });
});



