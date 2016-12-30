"use strict";
var express = require("express");
var http = require("http");
var path = require("path");
var connectionManager = require("./connectionManager");
var api = require("./routers/api");
var imageApi_1 = require("./routers/imageApi");
var app = express();
connectionManager.connect().then(function () {
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
    app.use("/imageapi", imageApi_1.default());
    app.get("/*", function (req, res) {
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
//# sourceMappingURL=app.js.map