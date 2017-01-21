"use strict";
var express = require("express");
var connectionManager_1 = require("../connectionManager");
var Busboy = require("busboy");
var authentication_1 = require("../authentication");
var uploadLimit = 2 * 1024 * 1024;
//This is a REST API module for logged in users.
exports.api = express();
exports.api.get('/userUploads', authentication_1.headerJWTCheck, function (req, res) {
    connectionManager_1.gfs.collection('userImages').find({ 'metadata.user': req.user.sub }).sort({ dateAdded: 1 }).toArray(function (err, images) {
        if (err)
            res.json(err);
        else
            res.json(images);
    });
});
exports.api.get('/userUploads/:id', authentication_1.queryJWTCheck, function (req, res) {
    connectionManager_1.gfs.createReadStream({ _id: req.params['id'], metadata: { user: req.user.sub }, root: 'userImages' }).pipe(res);
});
exports.api.post("/uploadImage", authentication_1.headerJWTCheck, function (req, res) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = function (err) { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            var ws = connectionManager_1.gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "userImages", metadata: { user: req.user.sub } });
            file.pipe(ws);
            ws.on('finish', function () {
                res.send(ws.id.toString());
            });
        }
        else {
            file.resume();
            res.sendStatus(415);
        }
    });
    req.pipe(busboy);
});
//# sourceMappingURL=userAPI.js.map