import { Component, OnInit, OnDestroy } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs/observable'

interface ItextField {
    top?: number;
    left?: number;
    text?: String;
    index?: number;
    fontSize?: String;
    color?: String;
}

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/details.html"
})
export class DetailsComponent implements OnInit, OnDestroy {
    //private sub: Observable<string>;
    private sub: any;

    textFields: ItextField[] = [];
    imageID: String;
    fieldsCounter: Number = 0;
    selectedIndex: Number = -1;

    dragging: Boolean = false;
    sx: Number;
    sy: Number;
    offestX: Number;
    offestY: Number;

    constructor(private route: ActivatedRoute) {
        //this.imageID = route.params['value']['id']; //old way
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.imageID = params['id'];
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    removeField = function () {
        if (this.selectedIndex != -1) {
            this.textFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    addField = function () {
        let t: ItextField = {
            left: 0,
            top: 0,
            text: "some text goes here",
            fontSize: "20.06pt",
            color: "#337ab7",
            index: this.fieldsCounter++
        };
        this.textFields.push(t);
    };
    mouseDown = function (fieldIndex: number, event: MouseEvent) {
        if (event.button == 0) {
            this.selectedIndex = fieldIndex;
            this.dragging = true;
            this.sx = event.clientX;
            this.sy = event.clientY;
            this.offestX = event.offsetX;
            this.offestY = event.offsetY;
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