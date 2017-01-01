var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var templateSchema = {
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
    }
};

module.exports = mongoose.model('template', templateSchema);
