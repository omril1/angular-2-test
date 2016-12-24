let mongoose = require('mongoose');
let Grid = require('gridfs-stream');
let Busboy = require('busboy');

//var sizeOf = require('image-size');
import * as express from 'express';

let api = express();

// create or use an existing mongodb-native db instance
//Grid.mongo = mongoose.mongo;
mongoose.connection.once('open', function () {
    var gfs = Grid(mongoose.connection.db);
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
        gfs.files.find({ contentType: /^image[/]/ }, { _id: 1, filename: 1 }).toArray(function (err: Error, files: any[]) {
            if (err)
                res.send(err);
            else
                res.send(files);
        })
    });
    api.post("/upload", function (req: any, res: express.Response) {
        var busboy = new Busboy({
            headers: req.headers,
            limits: { fileSize: 2 * 1024 * 1024, files: 1 }
        });
        busboy.on('file', function (fieldname: string, file: any, filename: string, encoding: string, mimetype: string) {
            if (mimetype.startsWith('image/')) {
                var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype });
                file.pipe(ws);
                res.statusCode = 200;
            }
            else {
                file.resume();
                res.statusCode = 415;
            }

        });
        busboy.on('finish', function () {
            res.end();
        });
        req.pipe(busboy);
    });

});

export = api;