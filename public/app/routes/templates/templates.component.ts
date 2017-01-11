import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService, Template } from '../../services/image.service';
import { ModalDirective } from 'ng2-bootstrap';

@Component({
    moduleId: module.id,
    templateUrl: "./templates.html",
    providers: [ImageService],
    styleUrls: ["templates.css"]
})
export class TemplatesComponent implements OnInit {
    private templateList: Template[];
    private selectedTemplate: Template;
    private pageSizes: string[];
    @ViewChild('modal') public modal: ModalDirective;


    constructor(
        private imageService: ImageService,
        private router: Router) {
        this.pageSizes = Object.keys(imageService.pageSizes);
    }

    public ngOnInit() {
        this.imageService.getTemplates().then(
            value => this.templateList = value
        );
    }
    public openModal(template) {
        this.selectedTemplate = template;
        this.modal.show();
    }
}