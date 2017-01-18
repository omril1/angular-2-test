"use strict";
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
    api.get("/byname/:filename", function (req, res) {
        var options = { filename: req.params['filename'], root: 'tempBases' };
        gfs.exist(options, function (err, result) {
            if (err)
                res.json(err);
            else if (result) {
                gfs.createReadStream(options).pipe(res);
            }
            else
                res.sendStatus(404);
        });
    });
    api.get('/byid/:id', function (req, res) {
        var options = { _id: req.params['id'], root: 'tempBases' };
        gfs.findOne(options, function (err, file) {
            if (err)
                return res.sendStatus(400);
            if (!file)
                return res.sendStatus(404);
            res.set('Content-Type', file.contentType);
            gfs.createReadStream(options).pipe(res);
        });
    });
    api.get('/thumbnail/:id', function (req, res) {
        var options = { _id: req.params['id'], root: 'thumbnails' };
        gfs.findOne(options, function (err, file) {
            if (err)
                return res.sendStatus(400);
            else if (!file)
                return res.sendStatus(404);
            else {
                var resize = im().resize('250x180').quality(90);
                resize.on('error', function (error) { return console.log(error); });
                res.set('Content-Type', file.contentType);
                res.on('error', function (error) { return console.log(error); });
                gfs.createReadStream(options)
                    .pipe(res);
            }
        });
    });
    api.get("/templates", function (req, res) {
        TemplateModel.find({}).sort({ dateAdded: 1 }).exec(function (err, templates) {
            if (err)
                res.json(err);
            else
                res.json(templates);
        });
    });
    api.get("/template/:tempname", function (req, res) {
        TemplateModel.findById(req.params['tempname']).exec(function (err, template) {
            if (err)
                res.json(err);
            else {
                if (template)
                    res.json(template);
                else
                    res.sendStatus(404);
            }
        });
    });
    api.post("/upload", function (req, res) {
        var busboy = new Busboy({ headers: req.headers, limits: { fileSize: 2 * 1024 * 1024, files: 1 } });
        var logError = function (err) { console.log(err); res.sendStatus(415); };
        busboy.on('error', logError);
        busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
            if (mimetype.startsWith('image/')) {
                var options = { filename: filename, content_type: mimetype, root: "tempBases" };
                var ws = gfs.createWriteStream(options);
                ws.on('finish', function () {
                    var template = new TemplateModel({ imageId: ws.id, name: filename });
                    template.save(function (err, result) {
                        if (err)
                            console.log(err);
                        else
                            res.sendStatus(200);
                    });
                });
                ws.on('error', logError);
                file.on('error', logError);
                file.pipe(ws);
            }
            else {
                file.resume();
                res.sendStatus(415);
            }
        });
        req.pipe(busboy);
    });
    api.post("/proccessimage", function (req, res) {
        processImage_1.default(req.body, res);
    });
    api.get("/dummypdf/:templateId", function (req, res) {
        if (req.params['templateId'].endsWith('.pdf')) {
            var templateId = req.params['templateId'].replace('.pdf', '');
            TemplateModel.findById(templateId).exec(function (err, template) {
                if (err)
                    res.json(err);
                else {
                    if (template) {
                        console.time("phantom-html-to-pdf");
                        var conversion = require("phantom-html-to-pdf")();
                        console.timeEnd("phantom-html-to-pdf");
                        console.time("phantom-html-to-pdf build");
                        conversion({
                            html: buildHtml(template._doc),
                            paperSize: {
                                /*format: 'A5',*/ width: '561.26px', height: '793.700px', margin: {
                                    "top": "-6px",
                                    "right": "0cm",
                                    "bottom": "0cm",
                                    "left": "0cm"
                                },
                            },
                            fitToPage: true,
                            viewportSize: {
                                width: 1920,
                                height: 800
                            },
                        }, function (err, pdf) {
                            if (err)
                                console.log(err);
                            else {
                                if (pdf == undefined) {
                                    console.log("pdf is undefined");
                                    res.sendStatus(404);
                                }
                                else {
                                    console.log(pdf.logs);
                                    console.log(pdf.numberOfPages);
                                    pdf.stream.pipe(res);
                                }
                            }
                        });
                        console.time("phantom-html-to-pdf build");
                    }
                    else
                        res.sendStatus(404);
                }
            });
        }
    });
    api.get("/dummypdf2/:templateId", function (req, res) {
        if (req.params['templateId'].endsWith('.pdf')) {
            var templateId = req.params['templateId'].replace('.pdf', '');
            TemplateModel.findById(templateId).exec(function (err, template) {
                if (err)
                    res.json(err);
                else {
                    if (template) {
                        console.time('html-pdf');
                        var pdf = require('html-pdf');
                        console.timeEnd('html-pdf');
                        console.time('html-pdf build');
                        var options = {
                            format: 'A5', orientation: "portrait", margin: "0 0 0 0", border: "0", "base": "http://localhost"
                        };
                        pdf.create(buildHtml(template._doc), options).toStream(function (err, stream) {
                            stream.pipe(res);
                        });
                        console.timeEnd('html-pdf build');
                    }
                    else
                        res.sendStatus(404);
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
        var filePath = path.join(tempPath, req.params['filename']);
        if (fs.existsSync(filePath))
            res.sendFile(filePath);
        else
            res.sendStatus(404);
    });
    return api;
    function buildHtml(template) {
        var templateHtml = "\n        <html>\n        <head><meta charset=\"utf-8\" />\n        <style>*{margin:0;}</style>\n        <link rel=\"stylesheet\" href=\"http://omri-pc/app/routes/details/details.css\"/>\n        </head>\n        <body style=\"\">\n        <div class=\"print-area\" style=\"width: 561.26px; height: 793px;left:0;top:0;\">\n            <div class=\"fields-container\">";
        for (var _i = 0, _a = template.moveableFields; _i < _a.length; _i++) {
            var field = _a[_i];
            var div = "<div class=\"moveableField\" style=\"position: absolute;" + buildFieldStyle(field) + "\">";
            if (field.isImage)
                div += "<img src=\"http://omri-pc/imageapi/byid/" + field.imageId + "\" style=\"width:100%;height:100%;\" />";
            else
                div += field.text;
            div += '</div>';
            templateHtml += div;
        }
        templateHtml +=
            "</div>\n            <img src=\"http://omri-pc/imageapi/byid/" + template.imageId + "\" style=\"width:100%;height:100%;\"/>\n        </div></body></html>\n        ";
        return templateHtml;
    }
    function buildFieldStyle(field) {
        var result = "\n                left: " + field.left + "px;\n                top: " + field.top + "px;\n                width: " + field.width + "px;\n                height: " + field.height + "px;\n                transform: rotateZ(" + field.rotation + "deg);";
        if (!field.isImage) {
            var textShadow = field.shadow.blur != -1 ? (field.shadow.color + " " + field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px') : 'none';
            result += "\n                font-size: " + field.fontSize + "px;\n                color: " + field.color + ";\n                font-family: " + field.font + ";\n                text-align: " + field.align + ";\n                word-spacing: " + field.wordSpace + "px;\n                letter-spacing: " + field.letterSpace + "px;\n                font-weight: " + (field.bold ? 'bold' : 'normal') + ";\n                font-style: " + (field.italic ? 'italic' : 'normal') + ";\n                text-decoration: " + (field.underline ? 'underline' : 'none') + ";\n                -webkit-text-stroke-color: " + field.stroke.color + ";\n                -webkit-text-stroke-width: " + field.stroke.width / 10 + "px;\n                text-shadow: " + textShadow + ";";
        }
        return result;
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = api;
;
//# sourceMappingURL=imageAPI.js.map