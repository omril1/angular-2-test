"use strict";
var fs = require("fs");
var os = require("os");
var path = require("path");
var PImage = require('pureimage');
var Grid = require('gridfs-stream');
var mongoose = require('mongoose');
var connectionManager = require("./connectionManager");
var fnt = PImage.registerFont('D:\\Coding\\angular 2 reconstructed project\\node_modules\\pureimage\\tests\\fonts\\SourceSansPro-Regular.ttf', 'Source Sans Pro');
function processImage(image, res) {
    var gfs = connectionManager.gfs;
    gfs.findOne({ _id: image.ID }, function (err, result) {
        var rs = gfs.createReadStream({ _id: image.ID });
        if (result.contentType == "image/png") {
            PImage.decodePNG(rs, function (img1, err) {
                try {
                    fnt.load(function () {
                        var ctx = img1.getContext('2d');
                        ctx.fillStyle = "red";
                        ctx.setFont('Source Sans Pro', 100);
                        //ctx.strokeStyle = "blue";
                        //ctx.strokeText("hello", 100, 100);
                        ctx.fillText("hello2", 120, 120);
                        var fileName = "tmp" + Date.now() + ".png";
                        var filePath = path.join(os.tmpdir(), 'imageProcessingApp', fileName);
                        PImage.encodePNG(img1, fs.createWriteStream(filePath), function (err) {
                            res.send('/imageapi/tempFile/' + fileName);
                        });
                    });
                }
                catch (err) {
                    console.log(err);
                    res.send(500);
                }
            });
        }
    });
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = processImage;
;
//# sourceMappingURL=processImage.js.map