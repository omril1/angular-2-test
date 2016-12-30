﻿import * as express from 'express';
import * as http from 'http';
import * as path from 'path';
import * as connectionManager from './connectionManager';
import * as api from './routers/api';
import { default as imageApi } from './routers/imageApi';

var app = express();
connectionManager.connect().then(() => {

    app.set('port', process.env.PORT || 80);
    app.use(express.favicon());
    app.use(express.logger('dev'));
    app.use(express.methodOverride());

    app.use("/node_modules", express.static(__dirname + "/node_modules"));
    app.use(express.static(__dirname + '/public'));

    app.use(express.json());
    //app.use(express.bodyParser());
    app.use(express.urlencoded());
    app.use("/api", api);
    app.use("/imageapi", imageApi());
    app.get("/*", (req: express.Request, res: express.Response) => {
        if (req.path.endsWith('.js') == false)
            res.sendfile(path.join(__dirname, "public", "index.html"));
        else
            res.send(404);
    });

    // development only
    if ('development' == app.get('env')) {
        app.use(express.errorHandler());
    }

    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
});