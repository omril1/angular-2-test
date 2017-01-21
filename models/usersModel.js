"use strict";
var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = new mongoose.model('users', {
    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
});
//# sourceMappingURL=usersModel.js.map