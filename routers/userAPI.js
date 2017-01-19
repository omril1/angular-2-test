"use strict";
var express = require("express");
var csurf = require('csurf');
var connectionManager = require("../connectionManager");
var api = express();
//api.use(express.csrf());
api.get('/userUploads', function (req, res) {
    var gfs = connectionManager.gfs;
    gfs.files.find({}).sort({ dateAdded: 1 }).toArray(function (err, images) {
        if (err)
            res.json(err);
        else
            res.json(images);
    });
});
api.post('/login', function (req, res) {
});
module.exports = api;
//# sourceMappingURL=userAPI.js.map