var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

export default new mongoose.model('users', {
    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
});