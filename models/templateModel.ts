var mongoose = require('mongoose');
var shortid = require('shortid');
var Schema = mongoose.Schema;

export default mongoose.model('template', {
    _id: {
        type: String,
        default: shortid.generate
    },
    categoryId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    width: {
        type: Number,
        required: true
    },
    height: {
        type: Number,
        required: true
    },
    imageId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    thumbnailId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    moveableFields: {
        type: [{
            top: Number,
            left: Number,
            width: Number,
            height: Number,
            text: String,
            font: String,
            fontSize: Number,
            color: String,
            bold: Boolean,
            italic: Boolean,
            align: String,
            underline: Boolean,
            rotation: Number,
            stroke: {
                color: String,
                width: Number,
            },
            shadow: { x: Number, y: Number, blur: Number, color: String },
            letterSpace: Number,
            wordSpace: Number,


            isImage: Boolean,
            imageId: String,
            _id: false,
        }],
        default: []
    },
    dateAdded: {
        type: Date,
        default: Date.now
    }
});
