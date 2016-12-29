import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';
import { MenuItem, ContextMenu } from 'primeng/primeng';
import { ImageService, ItextField, Image } from '../services/image.service';

interface coordinates {
    x: number;
    y: number;
}

let parseElementRectangle = function (target: any) {
    return {
        left: Number(target.style.left.replace('px', '')),
        top: Number(target.style.top.replace('px', '')),
        width: Number(target.style.width.replace('px', '')),
        height: Number(target.style.height.replace('px', '')),
    }
}

@Component({
    moduleId: module.id,
    templateUrl: "./details.html",
    providers: [ImageService],
    styles: [`
    .textField {
        border-width: 1px;
        border-style: dashed;
        cursor: pointer;
        line-height: normal;
        overflow: hidden;
    }

    i.square-tile {
        position: inherit;
        width: 5px;
        height: 5px;
        border: solid 1px black;
        background: white;
        cursor: nw-resize;
    }`],
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('container') containerViewChild: HTMLDivElement;
    @ViewChild('contextmenu') contextmenu: ContextMenu;
    @ViewChild('printArea') printArea: ElementRef;

    private textFields = Array<ItextField>();
    private items: MenuItem[];
    private imageID: String;
    private imageWidth: number;
    private imageHeight: number;
    private fieldsCounter: Number = 0;
    private selectedIndex: Number = -1;
    private resizerCoordinates: coordinates = { x: 0, y: 0 };
    private fonts = ["Arial", "David Transparent", "Guttman Calligraphic", "Guttman David", "Guttman Stam", "Guttman Yad", "Guttman Yad-Brush", "Guttman-Aram", "Levenim MT", "Lucida Sans Unicode", "Microsoft Sans Serif", "Miriam Transparent", "Narkisim", "Tahoma"];

    constructor(private route: ActivatedRoute, private imageService: ImageService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            this.imageID = params['id'];
            this.imageHeight = parseInt(params['height']);
            this.imageWidth = parseInt(params['width']);
        });
        this.addField();
        this.items = [
            {
                label: 'File',
                items: [{
                    label: 'New',
                    icon: 'fa-plus',
                    items: [
                        { label: 'Project' },
                        { label: 'Other' },
                    ]
                },
                { label: 'Open' },
                { label: 'Quit' }
                ]
            },
            {
                label: 'Print',
                icon: 'fa-print',
                command: (event) => {
                }
            }
        ];
    }
    ngAfterViewInit() {
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
        this.textFields.push(<ItextField>{
            left: 1000 / 3,
            top: 30,
            width: 1000 / 3,
            height: 40,
            text: "טקסט לבדיקת תצוגה",
            font: "Arial",
            fontSize: 30,
            bold: true,
            align: 'center',
            italic: false,
            underline: false,
            color: "#337ab7",
            index: this.fieldsCounter++
        });
    };
    setProperty = function (propName: string, prop: any) {
        if (this.textFields[this.selectedIndex]) {
            this.textFields[this.selectedIndex][propName] = prop;
        }
    };
    hasProperty = function (propName: string, prop: any) {
        if (this.textFields[this.selectedIndex]) {
            return this.textFields[this.selectedIndex][propName] == prop;
        }
        else
            return false;
    };
    toggleProperty = function (propName: string) {
        if (this.textFields[this.selectedIndex]) {
            this.textFields[this.selectedIndex][propName] = !this.textFields[this.selectedIndex][propName];
        }
    }
    dragstart = function (fieldIndex: number, event: DragEvent) {
        this.selectedIndex = fieldIndex;
        this.color = this.textFields[this.selectedIndex].color;
        this.setResizer(event.target);
    }
    onDrag = function (fieldIndex: number, event: any) {
        let targetRectangle = parseElementRectangle(event.target);
        this.textFields[this.selectedIndex].left = targetRectangle.left;
        this.textFields[this.selectedIndex].top = targetRectangle.top;
        this.setResizer(event.target);
    }
    resize = function (event: DragEvent) {
        let targetRectangle = parseElementRectangle(event.srcElement);
        let parseX = Number(targetRectangle.left) - this.textFields[this.selectedIndex].left;
        let parseY = Number(targetRectangle.top) - this.textFields[this.selectedIndex].top;
        if (parseX < 0 || parseY < 0) {
            if (parseX < 0)
                this.resizerCoordinates.x = targetRectangle.left;
            if (parseY < 0)
                this.resizerCoordinates.y = targetRectangle.top;
        }
        else {
            this.textFields[this.selectedIndex].width = parseX;
            this.textFields[this.selectedIndex].height = parseY;
        }
    }
    private setResizer = function (target: HTMLLIElement) {
        let targetRectangle = parseElementRectangle(target);
        this.resizerCoordinates.x = targetRectangle.left + targetRectangle.width;
        this.resizerCoordinates.y = targetRectangle.top + targetRectangle.height;
    }
    private sendToProcessing() {
        this.imageService.sendToProcessing({ ID: this.imageID, textFields: this.textFields }).then(result => {
            window.open(result.text());
        });
    }
    private showContextMenu = (event) => {
        this.contextmenu.show(event);
    };
}