import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Messages } from '../../services/messages.service';

@Component({
    moduleId: module.id,
    templateUrl: './managment.html',
    styleUrls:['managment.css'],
})
export class ManagmentComponent implements OnInit {
    public uploader: FileUploader;

    constructor(private messages: Messages, private sanitizer: DomSanitizer) {
    }
    public ngOnInit() {
        this.uploader = new FileUploader({
            url: "/adminapi/something",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024, //3 MB
            //authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: false,
        });
        this.uploader.onAfterAddingAll = (files: FileItem[]) => {
            files.forEach(fileItem => {
                fileItem.file.name = fileItem.file.name.replace(/\.[^/.]+$/, "");
                (<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            });
        };
    }

}