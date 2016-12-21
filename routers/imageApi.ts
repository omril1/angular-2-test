let mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let Busboy = require('busboy');

import * as express from 'express';

let api = express();

// create or use an existing mongodb-native db instance
Grid.mongo = mongoose.mongo;

var conn = mongoose.createConnection('mongodb://localhost:27017/test');
var gfs: any;
conn.once('open', function () {
    gfs = Grid(conn.db);
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
    api.get("/allimages", (req: express.Request, res: express.Response) => {
        gfs.files.find({}).toArray(function (err: Error, files: any[]) {
            if (err)
                res.send(err);
            else
                res.send(files.map(file => [file.filename, file._id]));
        })
    });
    //api.post("/upload/:filename", (req: any, res: express.Response) => {
    //    req.pipe(gfs.createWriteStream({
    //        filename: req.params.filename
    //    }).on('close', function (savedFile: any) {
    //        console.log('file saved', savedFile);
    //        return res.json({ file: savedFile });
    //    }));
    //});
    api.post("/upload", function (req: any, res: express.Response) {
        var busboy = new Busboy({ headers: req.headers });
        busboy.on('file', function (fieldname: any, file: any, filename: any, encoding: any, mimetype: string) {
            var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
            file.pipe(ws);
        });
        busboy.on('finish', function () {
            res.send(200);
        });
        req.pipe(busboy);
    });

});

export = api;