"use strict";
var mongoose = require('mongoose');
var Grid = require('gridfs-stream');
var Busboy = require('busboy');
var express = require("express");
var api = express();
// create or use an existing mongodb-native db instance
Grid.mongo = mongoose.mongo;
var conn = mongoose.createConnection('mongodb://localhost:27017/test');
var gfs;
conn.once('open', function () {
    gfs = Grid(conn.db);
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
        gfs.files.find({}).toArray(function (err, files) {
            if (err)
                res.send(err);
            else
                res.send(files.map(function (file) { return [file.filename, file._id]; }));
        });
    });
    //api.post("/upload/:filename", (req: any, res: express.Response) => {
    //    req.pipe(gfs.createWriteStream({
    //        filename: req.params.filename
    //    }).on('close', function (savedFile: any) {
    //        console.log('file saved', savedFile);
    //        return res.json({ file: savedFile });
    //    }));
    //});
    api.post("/upload", function (req, res) {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
            file.pipe(ws);
        });
        busboy.on('finish', function () {
            res.send(200);
        });
        req.pipe(busboy);
    });
});
module.exports = api;
//# sourceMappingURL=imageApi.js.map