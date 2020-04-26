
var fs = require('fs');
var db = require("../models");
var passport = require("../config/passport");

module.exports = function(app) {

    app.get("/", function(req, res) {
        return fs.readFile(__dirname + "/../public/index.html", function(err, data) {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });  
    });

    app.get("/search", function(req, res) {
        return fs.readFile(__dirname + "/../public/search.html", function(err, data) {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });  
    });

    app.get("/collection", function(req, res) {
        return fs.readFile(__dirname + "/../public/collection.html", function(err, data) {
            if (err) throw err;
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        });  
    });

    //add get to get current user
    app.get("/api/user", function(req, res) {
        res.json(req.user);
    })

    app.get("/api/collection/:name", function(req, res) {
        let specificGal = req.params.name;
        db.Collections.findAll({
            where: {
                gallery: specificGal
            }
        }).then((dbGallery) =>{
            res.json(dbGallery);
        });
        console.log("works");
    });

    app.get("/api/gallery", function(req, res) {
        db.Gallery.findAll({}).then((dbGallery) => {
            res.json(dbGallery);
        })
    })

    app.get("/api/gallery/:user", function(req, res) {
        let currentUser = req.params.user;
        db.Gallery.findAll({
            where: {
                user: currentUser
            }
        }).then((dbGallery)=>{
            res.json(dbGallery);
        });
    });

    app.post("/api/login", passport.authenticate("local"), function(req, res) {
        res.json(req.user);
    })

    app.post("/api/signup", function(req, res) {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then(function() {
            res.redirect(307, "/api/login");//redirect to login?
        })
        .catch(function(err) {
            res.status(401).json(err);
        })
    })

    app.get("/logout", function(req, res) {
        req.logout();
        res.redirect("/");
      });

    app.post("/api/gallery", function(req, res) {
        db.Gallery.create(req.body).then(function(dbGallery) {
            res.json(dbGallery);
        })
    })

    app.post("/api/collection", function(req, res) {
        db.Collections.create(req.body).then(function(dbCollection) {
            res.json(dbCollection);
        });
    });

    app.delete("/api/gallery/:name", function(req, res) {
        db.Gallery.destroy({
            where: {
                name: req.params.name
            }
        }).then((dbGallery) => {
            res.json(dbGallery);
        })
    })
};