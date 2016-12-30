import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    moduleId: module.id,
    templateUrl: "./upload-image.html",
})
export class UploadImageComponent {
    public uploader: FileUploader = new FileUploader({
        url: "/imageapi/upload",
        allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
        removeAfterUpload: false,
        maxFileSize: 3 * 1024 * 1024
    });

    public hasBaseDropZoneOver: boolean = false;
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
}