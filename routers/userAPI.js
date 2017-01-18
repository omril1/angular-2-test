"use strict";
var express = require("express");
var csurf = require('csurf');
var api = express();
//api.use(express.csrf());
api.post('/login', function (req, res) {
});
module.exports = api;
//# sourceMappingURL=userAPI.js.map