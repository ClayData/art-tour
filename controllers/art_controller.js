
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

    app.get("/signup", function(req, res) {
        return fs.readFile(__dirname + "/../public/signuplogin.html", function(err, data) {
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
        db.Gallery.findAll({}).then((dbGallery)=>{
            res.json(dbGallery);
        });
    });

    app.post("/api/signup", function(req, res) {
        db.User.create({
            email: req.body.email,
            password: req.body.password
        }).then(function() {
            res.redirect()//redirect to login?
        })
    })

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

};