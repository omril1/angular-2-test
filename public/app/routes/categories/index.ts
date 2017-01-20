import { Component, OnInit, trigger, state, style, transition, animate } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ImageService } from '../../services/image.service';
import { Auth } from '../../services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { filterCategory } from '../../pipes/filterCategory';

@Component({
    moduleId: module.id,
    templateUrl: "./categories.html",
    providers: [ImageService],
    styleUrls: ["categories.css"],
    animations: [
        trigger('taskState', [
            state('inactive', style({ opacity: 1, })),
            state('active', style({ opacity: 1, })),
            state('void', style({ opacity: 0, display: 'none', })),
            transition('* => void', [
                animate('0.3s 8 ease', style({
                    opacity: '0'
                }))
            ])
        ])
    ],
})
export class CategoriesComponent implements OnInit {
    private categoryList: any[];
    private filter = "";
    public uploader: FileUploader = new FileUploader({
        url: "/adminapi/uploadCategory",
        allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
        removeAfterUpload: true,
        maxFileSize: 3 * 1024 * 1024, //3 MB
        authToken: 'Bearer ' + this.auth.id_token,
        autoUpload: true,
    });
    constructor(private imageService: ImageService, private auth: Auth, private sanitizer: DomSanitizer) { }
    public ngOnInit() {
        this.imageService.getCategories().then(value => { this.categoryList = value });
        this.uploader.onAfterAddingFile = (fileItem) => {
            (<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        }
        this.uploader.onCompleteItem = (item, response, status) => {
            if (status == 200)
                this.imageService.getCategories().then(value => { this.categoryList = value });
        }
    }
    private removeCategory(category, index) {
        this.imageService.removeCategory(category._id).then(() => {
            category.deleted = (category.deleted === 'active' ? 'inactive' : 'active');
            this.categoryList.splice(index, 1);
        });
    }
}