
var fs = require('fs');
var db = require("../models");

module.exports = function(app) {

app.get("/", function(req, res) {
    return fs.readFile(__dirname + "/../public/index.html", function(err, data) {
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