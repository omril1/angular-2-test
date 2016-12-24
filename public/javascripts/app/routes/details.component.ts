import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';

interface ItextField {
    top?: number;
    left?: number;
    width?: number;
    height?: number;
    text?: string;
    font?: string;
    index?: number;
    fontSize?: string;
    color?: string;
}

@Component({
    moduleId: module.id,
    templateUrl: "/html-routes/details.html",
    //styles: [`:host { position: relative; }`],
})
export class DetailsComponent implements OnInit, OnDestroy {

    textFields: ItextField[] = [];
    imageID: String;
    fieldsCounter: Number = 0;
    selectedIndex: Number = -1;
    public items: string[] = ['The first choice!',
        'And another choice for you.', 'but wait! A third!'];
    fonts = ["Arial",
        "David Transparent",
        "Guttman Calligraphic",
        "Guttman David",
        "Guttman Stam",
        "Guttman Yad",
        "Guttman Yad-Brush",
        "Guttman-Aram",
        "Levenim MT",
        "Lucida Sans Unicode",
        "Microsoft Sans Serif",
        "Miriam Transparent",
        "Narkisim",
        "Tahoma"];

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
        }
    };
    colorChanged = function (color: string) {
        this.color = color;
        if (this.selectedIndex != -1) {
            this.textFields[this.selectedIndex].color = color;
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
    };
    mouseDown = function (fieldIndex: number, event: MouseEvent) {
        if (event.button == 0) {
            this.selectedIndex = fieldIndex;
            if (fieldIndex != -1)
                this.color = this.textFields[this.selectedIndex].color;
        }
    }
}