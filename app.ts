import * as express from 'express';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';
import * as fs from 'fs';
import * as connectionManager from './connectionManager';
import imageAPI from './routers/imageAPI';
import { api as userAPI } from './routers/userAPI';
import { api as adminAPI } from './routers/adminAPI';
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import * as favicon from 'serve-favicon';
import * as serveStatic from 'serve-static';
import * as session from 'express-session';


var privateKey = fs.readFileSync('SSL/server.key', 'utf8');
var certificate = fs.readFileSync('SSL/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };

var app = express();
connectionManager.connect().then((mongooseConnection) => {
    const MongoStore = require('connect-mongo')(session);

    app.set('port', process.env['PORT'] || 80);
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(morgan('dev'));

    app.use("/node_modules", <any>serveStatic(__dirname + "/node_modules", { extensions: ['js', 'ts'], fallthrough: false, index: false, redirect: false }));
    app.use(<any>serveStatic(__dirname + '/public'));

    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: true }))
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: 'super awesome secret key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: Date.now() + 3600000 },
        store: new MongoStore({ mongooseConnection: mongooseConnection })
    }));
    app.use("/user", userAPI);
    app.use("/adminapi", adminAPI);
    app.use("/imageapi", imageAPI());
    app.get("/*", (req: express.Request, res: express.Response) => {
        if (req.path.endsWith('.js') == false)
            res.sendFile(path.join(__dirname, "public", "index.html"));
        else
            res.sendStatus(404);
    });

    http.createServer(<any>app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
    //https.createServer({ cert: certificate, key: privateKey }, app).listen(443, function () {
    //    console.log('Express server listening on port ' + 443);
    //});
});