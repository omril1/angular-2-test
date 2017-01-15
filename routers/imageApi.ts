/// <reference path="../public/app/routes/details/details.component.ts" />
//let mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let Busboy = require('busboy');
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as connectionManager from '../connectionManager';
const im = require('imagemagick-stream');
import processImage from "../processImage";
import * as express from 'express';

var TemplateModel = require('../models/templateModel');

export interface Template {
    name?: string;
    _id: string;
    imageId: string;
    moveableFields: moveableField[];
}
export interface moveableField {
    top: number;
    left: number;
    width: number;
    height: number;
    rotation: number;
    isImage: boolean;

    text?: string;
    font?: string;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    align?: string;
    underline?: boolean;
    stroke?: {
        color: string;
        width: number;
    };
    shadow?: {
        color: string;
        x: number;
        y: number;
        blur: number;
    };
    letterSpace?: number;
    wordSpace?: number;

    imageId?: string;
}

let tempPath = path.join(os.tmpdir(), 'imageProcessingApp');

export default function api() {
    let api = express();
    let gfs = connectionManager.gfs;

    //api.use(express.csrf());
    api.get("/byname/:filename", (req: express.Request, res: express.Response) => {
        gfs.exist({ filename: req.params.filename }, function (err: Error, result: any) {
            if (err)
                res.send(err);
            else if (result) {
                gfs.createReadStream({ filename: req.params.filename }).pipe(res);
            }
            else
                res.send(404);
        });
    });
    api.get('/byid/:id', (req: express.Request, res: express.Response) => {
        gfs.findOne({ _id: req.params.id }, function (err: Error, file: any) {
            if (err) return res.status(400).send(err);
            if (!file) return res.send(404);

            res.set('Content-Type', file.contentType);

            gfs.createReadStream({ _id: file._id }).pipe(res);
        });
    });
    api.get('/thumbnail/:id', (req: express.Request, res: express.Response) => {
        gfs.findOne({ _id: req.params.id }, function (err: Error, file: any) {
            if (err)
                return res.status(400).send(err);
            else
                if (!file)
                    return res.send(404);
                else {
                    let resize = im().resize('250x180').quality(90);
                    res.set('Content-Type', file.contentType);
                    resize.on('error', error => console.log(error));
                    res.on('error', error => console.log(error));
                    gfs.createReadStream({ _id: file._id })
                        .pipe(resize)
                        .pipe(res);

                }
        });
    });
    api.get("/allimages", (req: express.Request, res: express.Response) => {
        gfs.files.find({ contentType: /^image[/]/ }, { _id: 1, filename: 1 }).toArray(function (err: Error, files: any[]) {
            if (err)
                res.send(err);
            else
                res.send(files);
        })
    });
    api.get("/templates", (req: express.Request, res: express.Response) => {
        TemplateModel.find({}).sort({ dateAdded: 1 }).exec(function (err: Error, templates: Template[]) {
            if (err)
                res.send(err);
            else
                res.send(templates);
        });
    });
    api.get("/template/:tempname", (req: express.Request, res: express.Response) => {
        TemplateModel.findById(req.params.tempname).exec(function (err: Error, template: Template) {
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
    api.post("/upload", function (req: any, res: express.Response) {
        var busboy = new Busboy({
            headers: req.headers,
            limits: { fileSize: 2 * 1024 * 1024, files: 1 }
        });
        var logError = (err) => {
            console.log(err);
            res.send(415);
        };
        busboy.on('error', logError);
        busboy.on('file', function (fieldname: string, file: any, filename: string, encoding: string, mimetype: string) {
            if (mimetype.startsWith('image/')) {
                var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
                ws.on('finish', function () {
                    let template = new TemplateModel({ imageId: ws.id, name: filename });
                    template.save((err, result) => {
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
    api.post("/proccessimage", (req: express.Request, res: express.Response) => {
        processImage(<Template>req.body, res);
    });
    api.get("/dummypdf/:templateId", (req: express.Request, res: express.Response) => {
        if (req.params.templateId.endsWith('.pdf')) {
            var templateId = req.params.templateId.replace('.pdf', '');
            TemplateModel.findById(templateId).exec(function (err: Error, template) {
                if (err)
                    res.send(err);
                else {
                    if (template) {
                        var conversion = require("phantom-html-to-pdf")();
                        conversion({
                            html: buildHtml(<Template>template._doc),
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

                        //var pdf = require('html-pdf');
                        //var options = {
                        //    format: 'letter', orientation: "portrait", margin: "0 0 0 0", width: '561.26px', height: '793.7px', border: "0", "base": "http://localhost"
                        //};
                        //pdf.create(buildHtml(<Template>template._doc), options).toStream(function (err, stream) {
                        //    stream.pipe(res);
                        //});
                    }
                    else
                        res.send(404);
                }
            });
        }
    });
    api.post("/save", (req: express.Request, res: express.Response) => {
        TemplateModel.findByIdAndUpdate(req.body._id, { $set: { moveableFields: req.body.moveableFields, name: req.body.name } }, { new: true }, function (err, template) {
            if (err)
                console.log(err);
            res.send(template);
        });
    });
    api.get('/tempFile/:filename', (req: express.Request, res: express.Response) => {
        let filePath = path.join(tempPath, req.params.filename);
        if (fs.existsSync(filePath))
            res.sendFile(filePath);
        else
            res.send(404);
    });
    return api;

    function buildHtml(template: Template) {
        let templateHtml = `
        <html>
        <head><meta charset="utf-8" /></head>
        <body>
        <div class="print-area" style="width:100%;height:100%;left:0;top:0;position: absolute;>
            <div class="fields-container">`;
        for (let field of template.moveableFields) {
            templateHtml +=
                `<div class="moveableField" style="position: absolute;${buildFieldStyle(field)}">
                    ${field.text || ''}
                </div>`
        }
        templateHtml +=
            `</div>
            <img class="base-image" src="http://omri-pc/imageapi/byid/${template.imageId}" style="width:100%;height:100%;"/>
        </div></body></html>
        `;
        return templateHtml;
    }

    function buildFieldStyle(field: moveableField) {
        var result = `
                left: ${field.left}px;
                top: ${field.top}px;
                width: ${field.width}px;
                height: ${field.height}px;
                transform: rotateZ(${field.rotation}deg);`
        if (field.isImage) {
            result += `
                background-image: url(http://localhost/imageapi/byid/${field.imageId});
                background-repeat: round;
            `
        }
        else {
            let textShadow = field.shadow.blur != -1 ? field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px ' + field.shadow.color : 'none';
            result += `
                font-size: ${field.fontSize}px;
                color: ${field.color};
                font-family: ${field.font};
                text-align: ${field.align};`;
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
};