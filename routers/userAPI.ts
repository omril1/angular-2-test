import * as express from 'express';
import { gfs } from '../connectionManager';
import * as Busboy from 'busboy';
import { queryJWTCheck, headerJWTCheck } from '../authentication';
const uploadLimit = 2 * 1024 * 1024;

//This is a REST API module for logged in users.
export let api = express();
api.get('/userUploads', headerJWTCheck, (req: any, res: express.Response) => {
    gfs.collection('userImages').find({ 'metadata.user': req.user.sub }).sort({ dateAdded: 1 }).toArray(function (err: Error, images) {
        if (err)
            res.json(err);
        else
            res.json(images);
    });
});
api.get('/userUploads/:id', queryJWTCheck, (req: any, res: express.Response) => {
    gfs.createReadStream({ _id: req.params['id'], metadata: { user: req.user.sub }, root: 'userImages' }).pipe(res);
});
api.post("/uploadImage", headerJWTCheck, function (req: any, res: express.Response) {
    var busboy = new Busboy({ headers: req.headers, limits: { fileSize: uploadLimit, files: 1 } });
    var logError = (err) => { console.log(err); res.sendStatus(415); };
    busboy.on('error', logError);
    busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        if (mimetype.startsWith('image/')) {
            var ws = gfs.createWriteStream({ filename: filename, content_type: mimetype, root: "userImages", metadata: { user: req.user.sub } });
            file.pipe(ws);
            ws.on('finish', () => {
                res.send(ws.id.toString());
            });
        }
        else {
            file.resume();
            res.sendStatus(415);
        }
    });
    req.pipe(busboy);
});