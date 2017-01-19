import * as express from 'express';
var csurf = require('csurf');
import * as connectionManager from '../connectionManager';

let api = express();
//api.use(express.csrf());
api.get('/userUploads', (req: express.Request, res: express.Response) => {
    let gfs = connectionManager.gfs;
    gfs.files.find({}).sort({ dateAdded: 1 }).toArray(function (err: Error, images) {
        if (err)
            res.json(err);
        else
            res.json(images);
    });
});
api.post('/login', (req: express.Request, res: express.Response) => {

});

export = api;