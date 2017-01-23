import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageService, Template } from '../../services/image.service';
import { ModalDirective } from 'ng2-bootstrap';
import { Auth } from '../../services/auth.service';
import { FileUploader } from 'ng2-file-upload';
import { Messages } from '../../services/messages.service';

@Component({
    moduleId: module.id,
    templateUrl: "./templates.html",
    providers: [ImageService],
    styleUrls: ["templates.css"]
})
export class TemplatesComponent implements OnInit {
    private templateList: Template[];
    private selectedTemplate: Template;
    private categoryId: string;
    private pageSizes: string[];
    @ViewChild('modal') public modal: ModalDirective;
    public uploader: FileUploader;

    constructor(private imageService: ImageService, private router: Router, private route: ActivatedRoute, private auth: Auth, private messages: Messages) {
        this.pageSizes = Object.keys(imageService.pageSizes);
        this.route.params.subscribe(params => {
            this.categoryId = params['categoryId'];
        });
    }

    public ngOnInit() {
        this.imageService.getTemplates(this.categoryId).then(value => {
            this.templateList = value;
        });
        this.uploader = new FileUploader({
            url: "/adminapi/uploadTemplate/" + this.categoryId,
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024, //3 MB
            authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: true,
        });
        this.uploader.onAfterAddingFile = (fileItem) => {
            //(<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.uploader.onCompleteItem = (item, response, status) => {
            if (status == 200) {
                this.templateList.unshift(JSON.parse(response));
            }
        };
    }
    public openModal(template) {
        if (this.auth.authenticated()) {
            this.selectedTemplate = template;
            this.modal.show();
        }
        else
            this.messages.warn("עליך להתחבר כדי להמשיך");
    }
}