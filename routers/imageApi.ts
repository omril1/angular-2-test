import * as Busboy from 'busboy';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as connectionManager from '../connectionManager';
import processImage from "../processImage";
import * as express from 'express';
import { ParsedAsJson } from 'body-parser';
const im = require('imagemagick-stream');
const uploadLimit = 2 * 1024 * 1024;
import templateModel from '../models/templateModel';

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

//This is a REST API module for free for all resources.
export default function api() {
    let api = express();
    let gfs = connectionManager.gfs;

    api.get("/byname/:filename", (req: express.Request, res: express.Response) => {
        let options = { filename: req.params['filename'], root: 'tempBases' }
        gfs.exist(options, function (err: Error, result: any) {
            if (err)
                res.json(err);
            else if (result) {
                gfs.createReadStream(options).pipe(res);
            }
            else
                res.sendStatus(404);
        });
    });
    api.get('/byid/:id', (req: express.Request, res: express.Response) => {
        let options = { _id: req.params['id'], root: 'tempBases' };
        gfs.findOne(options, function (err: Error, file: any) {
            if (err) return res.sendStatus(400);
            if (!file) return res.sendStatus(404);

            res.set('Content-Type', file.contentType);

            gfs.createReadStream(options).pipe(res);
        });
    });
    api.get('/thumbnail/:id', (req: express.Request, res: express.Response) => {
        let options = { _id: req.params['id'], root: 'thumbnails' };
        gfs.findOne(options, function (err: Error, file: any) {
            if (err)
                return res.sendStatus(400);
            else
                if (!file)
                    return res.sendStatus(404);
                else {
                    let resize = im().resize('250x180').quality(90);
                    resize.on('error', error => console.log(error));

                    res.set('Content-Type', file.contentType);
                    res.on('error', error => console.log(error));
                    gfs.createReadStream(options)
                        //.pipe(resize)
                        .pipe(res);

                }
        });
    });
    api.get("/templates", (req: express.Request, res: express.Response) => {
        templateModel.find({}).sort({ dateAdded: 1 }).exec(function (err: Error, templates: Template[]) {
            if (err) {
                res.json(err);
                console.log(err);
                return;
            }
            res.json(templates);
        });
    });
    api.get("/categories", (req: express.Request, res: express.Response) => {
        gfs.collection('categories').find().sort({'metadata.name':1}).toArray(function (err: Error, categories) {
            if (err) {
                res.json(err);
                console.log(err);
                return;
            }
            res.json(categories);
        });
    });
    api.get('/category/:id', (req: express.Request, res: express.Response) => {
        let options = { _id: req.params['id'], root: 'categories' };
        gfs.findOne(options, function (err: Error, file: any) {
            if (err)
                return res.sendStatus(400);
            else
                if (!file)
                    return res.sendStatus(404);
                else {
                    res.set('Content-Type', file.contentType);
                    res.on('error', error => console.log(error));
                    gfs.createReadStream(options)
                        .pipe(res);
                }
        });
    });
    api.get("/template/:tempname", (req: express.Request, res: express.Response) => {
        templateModel.findById(req.params['tempname']).exec(function (err: Error, template: Template) {
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
    api.get("/dummypdf/:templateId", (req: express.Request & ParsedAsJson, res: express.Response) => {
        if (req.params['templateId'].endsWith('.pdf')) {
            var templateId = req.params['templateId'].replace('.pdf', '');
            templateModel.findById(templateId).exec(function (err: Error, template) {
                if (err)
                    res.json(err);
                else {
                    if (template) {
                        console.time("phantom-html-to-pdf");
                        var conversion = require("phantom-html-to-pdf")();
                        console.timeEnd("phantom-html-to-pdf");
                        console.time("phantom-html-to-pdf build");
                        conversion({
                            html: buildHtml(<Template>template._doc),
                            paperSize: {
                                /*format: 'A5',*/ width: '561.26px', height: '793.700px', margin: {
                                    "top": "-6px",            // default is 0, units: mm, cm, in, px 
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
    api.get("/dummypdf2/:templateId", (req: express.Request, res: express.Response) => {
        if (req.params['templateId'].endsWith('.pdf')) {
            var templateId = req.params['templateId'].replace('.pdf', '');
            templateModel.findById(templateId).exec(function (err: Error, template) {
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
                        pdf.create(buildHtml(<Template>template._doc), options).toStream(function (err, stream) {
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

    api.post("/proccessimage", (req: express.Request & ParsedAsJson, res: express.Response) => {
        processImage(<Template>req.body, res);
    });
    api.post("/save", (req: express.Request & ParsedAsJson & ParsedAsJson, res: express.Response) => {
        templateModel.findByIdAndUpdate(req.body._id, { $set: { moveableFields: req.body.moveableFields, name: req.body.name } }, { new: true }, function (err, template) {
            if (err)
                console.log(err);
            res.send(template);
        });
    });
    return api;

    function buildHtml(template: Template) {
        let templateHtml = `
        <html>
        <head><meta charset="utf-8" />
        <style>*{margin:0;}</style>
        <link rel="stylesheet" href="http://omri-pc/app/routes/details/details.css"/>
        </head>
        <body style="">
        <div class="print-area" style="width: 561.26px; height: 793px;left:0;top:0;">
            <div class="fields-container">`;
        for (let field of template.moveableFields) {
            var div = `<div class="moveableField" style="position: absolute;${buildFieldStyle(field)}">`
            if (field.isImage)
                div += `<img src="http://omri-pc/imageapi/byid/${field.imageId}" style="width:100%;height:100%;" />`;
            else
                div += field.text;
            div += '</div>';
            templateHtml += div;
        }
        templateHtml +=
            `</div>
            <img src="http://omri-pc/imageapi/byid/${template.imageId}" style="width:100%;height:100%;"/>
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
        if (!field.isImage) {
            let textShadow = field.shadow.blur != -1 ? (field.shadow.color + " " + field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px') : 'none';
            result += `
                font-size: ${field.fontSize}px;
                color: ${field.color};
                font-family: ${field.font};
                text-align: ${field.align};
                word-spacing: ${field.wordSpace}px;
                letter-spacing: ${field.letterSpace}px;
                font-weight: ${field.bold ? 'bold' : 'normal'};
                font-style: ${field.italic ? 'italic' : 'normal'};
                text-decoration: ${field.underline ? 'underline' : 'none'};
                -webkit-text-stroke-color: ${field.stroke.color};
                -webkit-text-stroke-width: ${field.stroke.width / 10}px;
                text-shadow: ${textShadow};`;
        }
        return result;
    }
};