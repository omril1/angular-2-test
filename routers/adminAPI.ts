import * as express from 'express';
import { gfs } from '../connectionManager';
import * as Busboy from 'busboy';
import templateModel from '../models/templateModel';
const im = require('imagemagick-stream');
const uploadLimit = 2 * 1024 * 1024;

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