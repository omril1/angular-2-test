import { Component } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/upload-image.html",
})
export class UploadImageComponent {
    public uploader: FileUploader = new FileUploader({ url: "/imageapi/upload" });

    public hasBaseDropZoneOver: boolean = false;
    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }
}