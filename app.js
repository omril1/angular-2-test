"use strict";
var express = require("express");
var http = require("http");
var path = require("path");
var api = require('./routers/api');
var imageApi = require('./routers/imageApi');
var app = express();
// all environments
app.set('port', process.env.PORT || 80);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.methodOverride());
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname + '/public'));
app.use("/api", api);
app.use("/imageapi", imageApi);
app.use(express.json());
app.use(express.urlencoded());
app.get("/*", function (req, res) {
    res.sendfile(path.join(__dirname, "public", "index.html"));
});
// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
//# sourceMappingURL=app.js.map