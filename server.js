var express = require("express");
var session = require("express-session");

var passport = require("./config/passport");

var PORT = process.env.PORT || 5000;
var db = require("./models");

var app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));
app.use(session({ secret: "bad pickle", 
                  resave: true, 
                  saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


// Import routes and give the server access to them.
require("./controllers/art_controller")(app);

db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});