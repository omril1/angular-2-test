var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
module.exports = new mongoose.model('users', {
    username: {
        type: String, required: true
    },
    password: {
        type: String, required: true
    },
});
//# sourceMappingURL=usersModel.js.map