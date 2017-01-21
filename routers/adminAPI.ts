﻿import * as express from 'express';
import { gfs } from '../connectionManager';
import * as Busboy from 'busboy';
import templateModel from '../models/templateModel';
const im = require('imagemagick-stream');
var Patient = require('patient-stream');
const uploadLimit = 2 * 1024 * 1024;
import TemplateModel from '../models/templateModel';

//This is a REST API module for logged in users with role 'admin'.
export let api = express();
api.post("/uploadCategory", function (req: any, res: express.Response) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = (err) => { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            filename = filename.replace(/\.[^/.]+$/, "");
            var categoriesStream = gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "categories", metadata: { name: filename } });
            categoriesStream.on('error', logError);

            categoriesStream.on('finish', () => {
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
api.delete('/removeCategory/:_id', function (req, res) {
    let _id = req.params._id;
    gfs.remove({ root: "categories", _id: _id }, function (err) {
        if (err) {
            res.sendStatus(500);
            console.log(err);
            return;
        }
        res.sendStatus(200);
    });
});
api.post("/uploadTemplate", function (req: any, res: express.Response) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = (err) => { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            //creating 4 streams, tempStream for base image, thumbStream for the thumbnail,
            // resize to transform the big image into a smaller one, and tee to split the stream into the 2 of them.
            //resize is connected to thumbStream and the teeStream.
            //file is the stream we get from busboy.
            var tempStream = gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "tempBases" });
            var thumbStream = gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "thumbnails" });
            var resize = im().resize('250x180').quality(90);
            var tee = new Patient(2);

            //log errors the of the streams, and send status as needed.
            resize.on('error', logError);
            tempStream.on('error', logError);
            thumbStream.on('error', logError);
            file.on('error', logError);

            //listen when the streams finish, and log.
            file.on('end', () => { console.log('fileStream end', new Date()); })
            tee.on('end', () => { console.log('tee end', new Date()); });
            tempStream.on('finish', () => { console.log('tempStream finished', new Date()); });
            thumbStream.on('finish', () => {
                console.log('thumbStream finished', new Date());
                let template = new TemplateModel({ imageId: tempStream.id, thumbnailId: thumbStream.id, name: filename });
                template.save((err, result) => {
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