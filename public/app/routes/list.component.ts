import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    moduleId: module.id,
    templateUrl: "./list.html",
    providers: [ImageService],
    styles: [`.image-item {height:200px;}
              .image-item a h4 {height:20px;margin-top:5px;}`]
})
export class ListComponent implements OnInit {
    name = 'About';
    imageList: any[];
    selectedImage: any;
    @ViewChild('modal') public modal: ModalDirective;
    constructor(
        private imageService: ImageService,
        private router: Router) {
    }

    ngOnInit() {
        this.imageService.getImageNames().then(
            value => this.imageList = value
        );
    }
    public openModal(image) {
        this.selectedImage = image;
        this.modal.show();
    }
    public baseImageSelect(height: number, width: number): void {
        this.modal.hide();
        this.router.navigate(['/details', this.selectedImage._id, height, width]);
    }
}