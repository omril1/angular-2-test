import { Component } from '@angular/core';
import { ImageService } from '../services/image.service'

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/list.html",
    //providers: [ImageService]
})
export class ListComponent {
    name = 'About';
    imageList: string[];
    constructor(private imageService: ImageService) {
        this.imageService.getImageNames().add(function (result: string[]) { this.imageList = result });
    }
}