import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    moduleId: module.id,
    templateUrl: "./upload-image.html",
    styles: [`
    .my-drop-zone {
        border: dotted 3px lightgray;
    }

    .nv-file-over {
        border: dotted 3px red;
    }`]
})
export class UploadImageComponent {

    constructor(private sanitizer: DomSanitizer) {
        //dirty way to add a thumbnail support.
        this.uploader.onAfterAddingFile = (fileItem) => {
            (<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        }
    }

    public uploader: FileUploader = new FileUploader({
        url: "/imageapi/upload",
        allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
        removeAfterUpload: false,
        maxFileSize: 3 * 1024 * 1024 //3 MB
    });
}