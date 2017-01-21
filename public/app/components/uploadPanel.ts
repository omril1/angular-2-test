import { Component, Output, OnInit, ElementRef, ViewChild, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { DomSanitizer } from '@angular/platform-browser';
import { ImageService } from '../services/image.service';
import { Auth } from '../services/auth.service';
import { noGhostImage } from '../utils';

@Component({
    moduleId: module.id,
    selector: 'upload-panel',
    templateUrl: './uploadPanel.html',
    styleUrls: ['uploadPanel.css']
})
export class uploadPanelComponent implements OnInit {
    private userUploads = [];
    @ViewChild('panel') private panel: ElementRef;
    public uploader: FileUploader = new FileUploader({
        url: "/user/uploadImage",
        allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
        removeAfterUpload: false, //TODO: change this and the success event.
        maxFileSize: 3 * 1024 * 1024,
        autoUpload: true,
        authToken: 'Bearer ' + this.auth.id_token
    });
    @Output()
    private dropFromPanel = new EventEmitter<any>();

    constructor(private imageService: ImageService, private sanitizer: DomSanitizer, private auth: Auth) {
        this.uploader.onAfterAddingFile = (fileItem) => {
            (<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.uploader.onSuccessItem = (item, response, status, headers) => {
            this.uploader.removeFromQueue(item);
            (<any>item)._id = response;
            this.userUploads.push(item);
        }
    }

    public ngOnInit() {
        if (this.auth.id_token)
            this.imageService.getUserUploadedImages().then((uploads: any[]) => {
                this.userUploads = uploads.map(upload => {
                    upload.previewUrl = '/user/userUploads/' + upload._id + "?id_token=" + this.auth.id_token;
                    return upload;
                });
            });
    }
    private dragStart(event) {
        event.srcElement.classList.add('dragged');
        noGhostImage(event);
    }
    private drag(event: DragEvent) {
        if (event.x > this.panel.nativeElement.getBoundingClientRect().width + 15)
            event.srcElement.classList.add('out-of-panel');
        else
            event.srcElement.classList.remove('out-of-panel');
    }
    private dragEnd(event, item) {
        if (event.x > this.panel.nativeElement.getBoundingClientRect().width + 15)
            this.dropFromPanel.emit({ _id: item._id, x: event.x - event.offsetX, y: event.y - event.offsetY, width: event.srcElement.clientWidth, height: event.srcElement.clientHeight });
        else
            event.srcElement.classList.remove('dragged');

        event.srcElement.style.left = "0";
        event.srcElement.style.top = "0";
    }

}