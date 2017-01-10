﻿import { Component, OnInit, ViewChild } from '@angular/core';
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
    templateList: Template[];
    selectedTemplate: Template;
    @ViewChild('modal') public modal: ModalDirective;
    constructor(
        private imageService: ImageService,
        private router: Router) {
    }

    ngOnInit() {
        this.imageService.getTemplates().then(
            value => this.templateList = value
        );
    }
    public openModal(template) {
        this.selectedTemplate = template;
        this.modal.show();
    }
}