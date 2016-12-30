"use strict";
//let mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Busboy = require('busboy');
var path = require("path");
var fs = require("fs");
var os = require("os");
var connectionManager = require("../connectionManager");
var im = require('imagemagick-stream');
var processImage_1 = require("../processImage");
//var sizeOf = require('image-size');
var express = require("express");
//mongoose.connection.db
function api() {
    var api = express();
    var gfs = connectionManager.gfs;
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
    api.get('/thumbnail/:id', function (req, res) {
        gfs.findOne({ _id: req.params.id }, function (err, file) {
            if (err)
                return res.status(400).send(err);
            else if (!file)
                return res.send(404);
            else {
                var resize = im().resize('250x180').quality(90);
                res.set('Content-Type', file.contentType);
                resize.on('error', function (error) { return console.log(error); });
                res.on('error', function (error) { return console.log(error); });
                gfs.createReadStream({ _id: file._id })
                    .pipe(resize)
                    .pipe(res);
            }
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
                ws.on('finish', function () {
                    res.statusCode = 200;
                    res.end();
                });
                ws.on('error', function (err) {
                    console.log(err);
                    res.statusCode = 415;
                    res.end();
                });
                file.on('error', function (err) {
                    console.log(err);
                    res.statusCode = 415;
                    res.end();
                });
                file.on('end', function () { return console.log('file end'); });
                file.on('finish', function () { return console.log('file finish'); });
                file.pipe(ws);
            }
            else {
                file.resume();
                res.statusCode = 415;
            }
        });
        busboy.on('finish', function () {
            console.log('busboy finish');
        });
        req.pipe(busboy);
    });
    api.post("/proccessimage", function (req, res) {
        processImage_1.default(req.body, res);
    });
    var tempPath = path.join(os.tmpdir(), 'imageProcessingApp');
    api.get('/tempFile/:filename', function (req, res) {
        var filePath = path.join(tempPath, req.params.filename);
        if (fs.existsSync(filePath))
            res.sendfile(filePath);
        else
            res.send(404);
    });
    return api;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = api;
;
//# sourceMappingURL=imageApi.js.map