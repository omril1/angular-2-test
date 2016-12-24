"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Busboy = require('busboy');
//var sizeOf = require('image-size');
var express = require("express");
var api = express();
// create or use an existing mongodb-native db instance
//Grid.mongo = mongoose.mongo;
mongoose.connection.once('open', function () {
    var gfs = Grid(mongoose.connection.db);
    api.get("/byname/:filename", function (req, res) {
        gfs.exist({ filename: req.params.filename }, function (err, result) {
            if (err)
                res.send(err);
            else if (result) {
                gfs.createReadStream({ filename: req.params.filename }).pipe(res);
            }
            else
                res.send(404);
        });
    });
    api.get('/byid/:id', function (req, res) {
        gfs.findOne({ _id: req.params.id }, function (err, file) {
            if (err)
                return res.status(400).send(err);
            if (!file)
                return res.send(404);
            res.set('Content-Type', file.contentType);
            gfs.createReadStream({ _id: file._id }).pipe(res);
        });
    });
    api.get("/allimages", function (req, res) {
        gfs.files.find({ contentType: /^image[/]/ }, { _id: 1, filename: 1 }).toArray(function (err, files) {
            if (err)
                res.send(err);
            else
                res.send(files);
        });
    });
    api.post("/upload", function (req, res) {
        var busboy = new Busboy({
            headers: req.headers,
            limits: { fileSize: 2 * 1024 * 1024, files: 1 }
        });
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            if (mimetype.startsWith('image/')) {
                var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
                file.pipe(ws);
                res.statusCode = 200;
            }
            else {
                file.resume();
                res.statusCode = 415;
            }
        });
        busboy.on('finish', function () {
            res.end();
        });
        req.pipe(busboy);
    });
});
module.exports = api;
//# sourceMappingURL=imageApi.js.map