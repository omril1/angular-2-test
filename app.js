"use strict";
var express = require("express");
var http = require("http");
var https = require("https");
var path = require("path");
var fs = require("fs");
var connectionManager = require("./connectionManager");
var api = require("./routers/api");
var imageApi_1 = require("./routers/imageApi");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var favicon = require('serve-favicon');
var serveStatic = require('serve-static');
var session = require('express-session');
var privateKey = fs.readFileSync('SSL/server.key', 'utf8');
var certificate = fs.readFileSync('SSL/server.crt', 'utf8');
var credentials = { key: privateKey, cert: certificate };
var app = express();
connectionManager.connect().then(function (mongooseConnection) {
    var MongoStore = require('connect-mongo')(session);
    app.set('port', process.env.PORT || 80);
    app.use(favicon(__dirname + '/public/favicon.ico'));
    app.use(morgan('dev'));
    app.use("/node_modules", serveStatic(__dirname + "/node_modules"));
    app.use(serveStatic(__dirname + '/public'));
    // parse application/x-www-form-urlencoded 
    app.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json 
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(session({
        secret: 'super awesome secret key',
        resave: false,
        saveUninitialized: false,
        cookie: { secure: true, maxAge: new Date(Date.now() + 3600000) },
        store: new MongoStore({ mongooseConnection: mongooseConnection })
    }));
    app.use("/api", api);
    app.use("/imageapi", imageApi_1.default());
    app.get("/*", function (req, res) {
        if (req.path.endsWith('.js') == false)
            res.sendFile(path.join(__dirname, "public", "index.html"));
        else
            res.send(404);
    });
    // development only
    //if ('development' == app.get('env')) {
    //    app.use(express.errorHandler());
    //}
    http.createServer(app).listen(app.get('port'), function () {
        console.log('Express server listening on port ' + app.get('port'));
    });
    https.createServer({ cert: certificate, key: privateKey }, app).listen(443, function () {
        console.log('Express server listening on port ' + 443);
    });
});
//# sourceMappingURL=app.js.map