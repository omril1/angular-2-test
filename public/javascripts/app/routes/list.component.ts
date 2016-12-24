import { Component } from '@angular/core';
import { ImageService } from '../services/image.service'

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/list.html",
    providers: [ImageService],
    styles: [`.image-item {height:200px;}
              .image-item a h4 {height:20px;margin-top:5px;}`]
})
export class ListComponent {
    name = 'About';
    imageList: any[];
    constructor(private imageService: ImageService) {
        this.imageService.getImageNames().forEach(
            value => this.imageList = value
        );
    }
}