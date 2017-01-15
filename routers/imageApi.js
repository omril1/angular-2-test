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
var express = require("express");
var TemplateModel = require('../models/templateModel');
var tempPath = path.join(os.tmpdir(), 'imageProcessingApp');
function api() {
    var api = express();
    var gfs = connectionManager.gfs;
    //api.use(express.csrf());
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
    api.get("/templates", function (req, res) {
        TemplateModel.find({}).sort({ dateAdded: 1 }).exec(function (err, templates) {
            if (err)
                res.send(err);
            else
                res.send(templates);
        });
    });
    api.get("/template/:tempname", function (req, res) {
        TemplateModel.findById(req.params.tempname).exec(function (err, template) {
            if (err)
                res.send(err);
            else {
                if (template)
                    res.send(template);
                else
                    res.send(404);
            }
        });
    });
    api.post("/upload", function (req, res) {
        var busboy = new Busboy({
            headers: req.headers,
            limits: { fileSize: 2 * 1024 * 1024, files: 1 }
        });
        var logError = function (err) {
            console.log(err);
            res.send(415);
        };
        busboy.on('error', logError);
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            if (mimetype.startsWith('image/')) {
                var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
                ws.on('finish', function () {
                    var template = new TemplateModel({ imageId: ws.id, name: filename });
                    template.save(function (err, result) {
                        if (err)
                            console.log(err);
                        else
                            res.send(200);
                    });
                });
                ws.on('error', logError);
                file.on('error', logError);
                file.pipe(ws);
            }
            else {
                file.resume();
                res.send(415);
            }
        });
        req.pipe(busboy);
    });
    api.post("/proccessimage", function (req, res) {
        processImage_1.default(req.body, res);
    });
    api.get("/dummypdf/:templateId", function (req, res) {
        if (req.params.templateId.endsWith('.pdf')) {
            var templateId = req.params.templateId.replace('.pdf', '');
            TemplateModel.findById(templateId).exec(function (err, template) {
                if (err)
                    res.send(err);
                else {
                    if (template) {
                        var conversion = require("phantom-html-to-pdf")();
                        conversion({
                            html: buildHtml(template._doc),
                            paperSize: {
                                format: 'A5', margin: "0px", width: '561.26px', height: '793.7px', headerHeight: 0, footerHeight: 0
                            },
                            fitToPage: false,
                            viewportSize: {
                                width: 1920,
                                height: 800
                            },
                        }, function (err, pdf) {
                            console.log(pdf.logs);
                            console.log(pdf.numberOfPages);
                            pdf.stream.pipe(res);
                        });
                    }
                    else
                        res.send(404);
                }
            });
        }
    });
    api.post("/save", function (req, res) {
        TemplateModel.findByIdAndUpdate(req.body._id, { $set: { moveableFields: req.body.moveableFields, name: req.body.name } }, { new: true }, function (err, template) {
            if (err)
                console.log(err);
            res.send(template);
        });
    });
    api.get('/tempFile/:filename', function (req, res) {
        var filePath = path.join(tempPath, req.params.filename);
        if (fs.existsSync(filePath))
            res.sendFile(filePath);
        else
            res.send(404);
    });
    return api;
    function buildHtml(template) {
        var templateHtml = "\n        <html>\n        <head><meta charset=\"utf-8\" /></head>\n        <body>\n        <div class=\"print-area\" style=\"width:100%;height:100%;left:0;top:0;position: absolute;>\n            <div class=\"fields-container\">";
        for (var _i = 0, _a = template.moveableFields; _i < _a.length; _i++) {
            var field = _a[_i];
            templateHtml +=
                "<div class=\"moveableField\" style=\"position: absolute;" + buildFieldStyle(field) + "\">\n                    " + (field.text || '') + "\n                </div>";
        }
        templateHtml +=
            "</div>\n            <img class=\"base-image\" src=\"http://omri-pc/imageapi/byid/" + template.imageId + "\" style=\"width:100%;height:100%;\"/>\n        </div></body></html>\n        ";
        return templateHtml;
    }
    function buildFieldStyle(field) {
        var result = "\n                left: " + field.left + "px;\n                top: " + field.top + "px;\n                width: " + field.width + "px;\n                height: " + field.height + "px;\n                transform: rotateZ(" + field.rotation + "deg);";
        if (field.isImage) {
            result += "\n                background-image: url(http://localhost/imageapi/byid/" + field.imageId + ");\n                background-repeat: round;\n            ";
        }
        else {
            var textShadow = field.shadow.blur != -1 ? field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px ' + field.shadow.color : 'none';
            result += "\n                font-size: " + field.fontSize + "px;\n                color: " + field.color + ";\n                font-family: " + field.font + ";\n                text-align: " + field.align + ";";
        }
        return result;
        /*
                word-spacing: ${field.wordSpace}px;
                letter-spacing: ${field.letterSpace}px;
                font-weight: ${field.bold ? 'bold' : 'normal'};
                font-style: ${field.italic ? 'italic' : 'normal'};
                text-decoration: ${field.underline ? 'underline' : 'none'};
                -webkit-text-stroke-color: ${field.stroke.color};
                -webkit-text-stroke-width: ${field.stroke.width / 10}px;
                text-shadow: ${textShadow};*/
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = api;
;
//# sourceMappingURL=imageApi.js.map