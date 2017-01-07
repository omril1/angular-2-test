var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;
var templateSchema = {
    _id: {
        type: String,
        'default': shortid.generate
    },
    name: String,
    imageId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    textFields: {
        type: [{
            top: Number,
            left: Number,
            width: Number,
            height: Number,
            text: String,
            font: String,
            index: Number,
            fontSize: Number,
            color: String,
            bold: Boolean,
            italic: Boolean,
            align: String,
            underline: Boolean,
            _id: false
        }],
        default: []
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
};

module.exports = mongoose.model('template', templateSchema);
