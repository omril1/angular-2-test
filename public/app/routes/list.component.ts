import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ImageService } from '../services/image.service';

@Component({
    moduleId: module.id,
    templateUrl: "./list.html",
    providers: [ImageService],
})
export class ListComponent {
}