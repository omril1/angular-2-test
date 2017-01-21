"use strict";
var express = require("express");
var connectionManager_1 = require("../connectionManager");
var Busboy = require("busboy");
var im = require('imagemagick-stream');
var Patient = require('patient-stream');
var uploadLimit = 2 * 1024 * 1024;
var templateModel_1 = require("../models/templateModel");
//This is a REST API module for logged in users with role 'admin'.
exports.api = express();
exports.api.post("/uploadCategory", function (req, res) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = function (err) { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            filename = filename.replace(/\.[^/.]+$/, "");
            var categoriesStream = connectionManager_1.gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "categories", metadata: { name: filename } });
            categoriesStream.on('error', logError);
            categoriesStream.on('finish', function () {
                res.sendStatus(200);
            });
            file.pipe(categoriesStream);
        }
        else {
            file.resume();
            res.sendStatus(415);
        }
    });
    req.pipe(busboy);
});
exports.api.delete('/removeCategory/:_id', function (req, res) {
    var _id = req.params._id;
    connectionManager_1.gfs.remove({ root: "categories", _id: _id }, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
            return;
        }
        res.sendStatus(200);
    });
});
exports.api.post("/uploadTemplate", function (req, res) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = function (err) { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            //creating 4 streams, tempStream for base image, thumbStream for the thumbnail,
            // resize to transform the big image into a smaller one, and tee to split the stream into the 2 of them.
            //resize is connected to thumbStream and the teeStream.
            //file is the stream we get from busboy.
            var tempStream = connectionManager_1.gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "tempBases" });
            var thumbStream = connectionManager_1.gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "thumbnails" });
            var resize = im().resize('250x180').quality(90);
            var tee = new Patient(2);
            //log errors the of the streams, and send status as needed.
            resize.on('error', logError);
            tempStream.on('error', logError);
            thumbStream.on('error', logError);
            file.on('error', logError);
            //listen when the streams finish, and log.
            file.on('end', function () { console.log('fileStream end', new Date()); });
            tee.on('end', function () { console.log('tee end', new Date()); });
            tempStream.on('finish', function () { console.log('tempStream finished', new Date()); });
            thumbStream.on('finish', function () {
                console.log('thumbStream finished', new Date());
                var template = new templateModel_1.default({ imageId: tempStream.id, thumbnailId: thumbStream.id, name: filename });
                template.save(function (err, result) {
                    if (err)
                        console.log(err);
                    else
                        res.sendStatus(200);
                });
            });
            //just pipe them, notice tee pipes twice.
            file.pipe(tee);
            tee.pipe(tempStream);
            tee.pipe(resize);
            resize.pipe(thumbStream);
        }
        else {
            file.resume();
            res.sendStatus(415);
        }
    });
    req.pipe(busboy);
});
//# sourceMappingURL=adminAPI.js.map