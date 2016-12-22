import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';

interface ItextField {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    text?: String;
    index?: number;
    fontSize?: String;
    color?: String;
}

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/details.html",
    styles: [`:host { position: relative; }`],
})
export class DetailsComponent implements OnInit, OnDestroy {

    textFields: ItextField[] = [];
    imageID: String;
    fieldsCounter: Number = 0;
    selectedIndex: Number = -1;

    public imageX = 0;
    public imageY = 0;

    dragging: Boolean = false;
    sx: Number;
    sy: Number;
    offestX: Number;
    offestY: Number;

    constructor(private route: ActivatedRoute) {
        //this.imageID = route.params['value']['id']; //old way
    }

    ngOnInit() {
        this.route.params.subscribe(params => this.imageID = params['id']);
    }

    ngOnDestroy() {
    }

    removeField = function () {
        if (this.selectedIndex != -1) {
            this.textFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
            //this.imageY = (this.selectedIndex == -1 ? 0 : -2) - (this.textFields.length * 40);
        }
    };
    addField = function () {
        let t: ItextField = {
            left: 20,
            top: 30,
            width: 400,
            height: 40,
            text: "some text goes here",
            fontSize: "20.06pt",
            color: "#337ab7",
            index: this.fieldsCounter++
        };
        this.textFields.push(t);
        //this.imageY = (this.selectedIndex == -1 ? 0 : -2) - (this.textFields.length * 40);
    };
    mouseDown = function (fieldIndex: number, event: MouseEvent) {
        if (event.button == 0) {
            this.selectedIndex = fieldIndex;
            this.dragging = true;
            this.sx = event.clientX;
            this.sy = event.clientY;
            this.offestX = event.offsetX;
            this.offestY = event.offsetY;
            //this.imageY = (this.selectedIndex == -1 ? 0 : -2) - (this.textFields.length * 40);
        }
    }
    mouseMove = function (fieldIndex: number, event: MouseEvent) {
        console.log("client", event.clientX, event.clientY);
        console.log("offest", event.offsetX, event.offsetY);
        console.log("layer", event.layerX, event.layerY);
        console.log("screen", event.screenX, event.screenY);
        if (this.selectedIndex == fieldIndex && this.dragging) {
            let cF: ItextField = this.textFields[fieldIndex];

            //let dx = event.x - this.xS;
            //let dy = event.y - this.yS;

            cF.left += event.clientX - this.sx;
            cF.top += event.clientY - this.sy;
        }
    }
    mouseUp = function (fieldIndex: Number, event: MouseEvent) {
        if (event.button == 0) {
            this.dragging = false;
        }
    }

}