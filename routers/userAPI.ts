import * as express from 'express';
var csurf = require('csurf');

let api = express();
//api.use(express.csrf());
api.post('/login', (req: express.Request, res: express.Response) => {

});

export = api;