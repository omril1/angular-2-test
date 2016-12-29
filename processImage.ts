import { Image } from './routers/imageApi';
import { Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
let PImage = require('pureimage');
let Grid = require('gridfs-stream');
let mongoose = require('mongoose');


import { default as connectToMongoDB } from './connectMongoDB';
let gfs;
connectToMongoDB().then((connection) => {
    gfs = Grid(connection, mongoose.mongo);
});

var fnt = PImage.registerFont('D:\\Coding\\angular 2 reconstructed project\\node_modules\\pureimage\\tests\\fonts', 'Source Sans Pro')


export default function processImage(image: Image, res: Response): void {
    gfs.findOne({ _id: image.ID }, (err, result) => {
        let rs = gfs.createReadStream({ _id: image.ID });
        if (result.contentType == "image/png") {
            PImage.decodePNG(rs, function (img1, err?) {
                try {
                    fnt.load(() => {
                        var ctx = img1.getContext('2d');

                        ctx.fillStyle = "red";
                        ctx.setFont('Source Sans Pro', 20);
                        //ctx.strokeStyle = "blue";
                        //ctx.strokeText("hello", 100, 100);
                        ctx.fillText("hello2", 120, 120);


                        var fileName = `tmp${Date.now()}.png`;
                        var filePath = path.join(os.tmpdir(), 'imageProcessingApp', fileName);
                        PImage.encodePNG(img1, fs.createWriteStream(filePath), function (err) {
                            res.send('/imageapi/tempFile/' + fileName);
                        });
                    });
                }
                catch (err) {
                    console.log(err)
                    res.send(500);
                }
            })
        }
    })
};