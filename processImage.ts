import { Template } from './routers/imageApi';
import { Response } from 'express';
import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
let PImage = require('pureimage');
import * as connectionManager from './connectionManager';


var fnt = PImage.registerFont('D:\\Coding\\angular 2 reconstructed project\\node_modules\\pureimage\\tests\\fonts\\SourceSansPro-Regular.ttf', 'Source Sans Pro')

export default function processImage(template: Template, res: Response): void {
    let gfs = connectionManager.gfs;
    gfs.findOne({ _id: template.imageId }, (err, result) => {
        let rs = gfs.createReadStream({ _id: template.imageId });
        if (result.contentType == "image/png") {
            PImage.decodePNG(rs, function (img1, err?) {
                try {
                    fnt.load(() => {
                        var ctx = img1.getContext('2d');

                        ctx.fillStyle = "red";
                        ctx.setFont('Source Sans Pro', 100);
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
                    res.sendStatus(500);
                }
            })
        }
    })
};