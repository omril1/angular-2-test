import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService, Template } from '../../services/image.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Auth } from '../../services/auth.service';
import { FileUploader, FileItem } from 'ng2-file-upload';
import { Messages } from '../../services/messages.service';

@Component({
    moduleId: module.id,
    templateUrl: "./templates.html",
    providers: [ImageService],
    styleUrls: ["templates.css"]
})
export class TemplatesComponent implements OnInit {
    @ViewChild('configureTemplate') public configureTemplate: ModalDirective;
    private templateList: Template[];
    private selectedTemplate: Template;
    private categoryId: string;
    private uploadWidth: number;
    private uploadHeight: number;
    public uploader: FileUploader;

    constructor(private imageService: ImageService, private router: Router, private route: ActivatedRoute, private auth: Auth, private messages: Messages, private sanitizer: DomSanitizer) {
        this.route.params.subscribe(params => {
            this.categoryId = params['categoryId'];
        });
    }

    public ngOnInit() {
        this.uploader = new FileUploader({
            url: "/adminapi/uploadTemplate/" + this.categoryId,
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024, //3 MB
            authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: false,
        });
        this.imageService.getTemplates(this.categoryId).then(value => {
            this.templateList = value;
        });
        this.uploader.onAfterAddingAll = (files: FileItem[]) => {
            this.configureTemplate.show();
            files.forEach(fileItem => {
                fileItem.file.name = fileItem.file.name.replace(/\.[^/.]+$/, "");
                (<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            });

            //workaround to get image dimentions.
            var img = document.createElement("img");
            img.src = window.URL.createObjectURL(files[0]._file);
            img.onload = () => {
                this.uploadWidth = img.naturalWidth;
                this.uploadHeight = img.naturalHeight;
            }
        };
        this.uploader.onCompleteItem = (item, response, status) => {
            if (status == 200) {
                this.templateList.unshift(JSON.parse(response));
            }
        };
    }
    private uploadAll() {
        this.configureTemplate.hide();
        this.uploader.queue.forEach(fileItem => { fileItem.file.name = JSON.stringify({ name: fileItem.file.name, width: this.uploadWidth, height: this.uploadHeight }) });
        this.uploader.uploadAll();
    }
    private dragModalStart(event) {
        event.dataTransfer.setDragImage(event.currentTarget, -99999, -99999)
    }
    private removeTemplate(template, index) {
        this.imageService.removeTemplate(template._id).then(() => {
            template.deleted = (template.deleted === 'active' ? 'inactive' : 'active');
            this.templateList.splice(index, 1);
        });
    }
}