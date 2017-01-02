import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';
import { MenuItem, ContextMenu, Message } from 'primeng/primeng';
import { ImageService, ItextField, Template } from '../services/image.service';
let domtoimage = require('dom-to-image');

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

    .square-tile i.bottom {
        position: absolute;
        width: 5px;
        height: 5px;
        left: -16px;
        border-top: 8px dashed;
        border-right: 8px solid transparent;
        border-left: 8px solid transparent;
    }
    .square-tile i.right {
        position: absolute;
        width: 5px;
        height: 5px;
        top: -16px;
        border-left: 8px dashed;
        border-top: 8px solid transparent;
        border-bottom: 8px solid transparent;
    }`],
})
export class DetailsComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChild('container') containerViewChild: HTMLDivElement;
    @ViewChild('contextmenu') contextmenu: ContextMenu;
    @ViewChild('printArea') printArea: ElementRef;

    //private textFields = Array<ItextField>();
    private items: MenuItem[];
    private template: Template;
    private imageWidth: number;
    private imageHeight: number;
    private fieldsCounter: Number = 0;
    private selectedIndex: Number = -1;
    private resizerCoordinates: coordinates = { x: 0, y: 0 };


    private msgs: Message[] = [];
    private fonts = ["Arial", "David Transparent", "Guttman Calligraphic", "Guttman David", "Guttman Stam", "Guttman Yad", "Guttman Yad-Brush", "Guttman-Aram", "Levenim MT", "Lucida Sans Unicode", "Microsoft Sans Serif", "Miriam Transparent", "Narkisim", "Tahoma"];

    constructor(private route: ActivatedRoute, private imageService: ImageService) {
    }

    ngOnInit() {
        this.route.params.subscribe(params => {
            //this.imageID = params['id'];
            this.imageService.getTemplate(params['id'])
                .then((template) =>
                    this.template = template);
            this.imageHeight = parseInt(params['height']);
            this.imageWidth = parseInt(params['width']);
        });
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

    removeField = function (index?: number) {
        if (index != undefined)
            this.template.textFields.splice(index, 1);
        else if (this.selectedIndex != -1) {
            this.template.textFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    colorChanged = function (color: string) {
        this.color = color;
        if (this.selectedIndex != -1) {
            this.template.textFields[this.selectedIndex].color = color;
        }
    };
    addField = function () {
        this.template.textFields.push(<ItextField>{
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
        if (this.template && this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = prop;
        }
    };
    hasProperty = function (propName: string, prop: any) {
        if (this.template && this.template.textFields[this.selectedIndex]) {
            return this.template.textFields[this.selectedIndex][propName] == prop;
        }
        else
            return false;
    };
    toggleProperty = function (propName: string) {
        if (this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = !this.template.textFields[this.selectedIndex][propName];
        }
    }
    dragstart = function (fieldIndex: number, event: DragEvent) {
        this.selectedIndex = fieldIndex;
        this.color = this.template.textFields[this.selectedIndex].color;
        this.setResizer(event.target);
    }
    onDrag = function (fieldIndex: number, event: any) {
        let targetRectangle = parseElementRectangle(event.target);
        this.template.textFields[this.selectedIndex].left = targetRectangle.left;
        this.template.textFields[this.selectedIndex].top = targetRectangle.top;
        this.setResizer(event.target);
    }
    resize = function (event: DragEvent) {
        let targetRectangle = parseElementRectangle(event.srcElement);
        let parseX = Number(targetRectangle.left) - this.template.textFields[this.selectedIndex].left;
        let parseY = Number(targetRectangle.top) - this.template.textFields[this.selectedIndex].top;
        if (parseX < 0 || parseY < 0) {
            if (parseX < 0)
                this.resizerCoordinates.x = targetRectangle.left;
            if (parseY < 0)
                this.resizerCoordinates.y = targetRectangle.top;
        }
        else {
            this.template.textFields[this.selectedIndex].width = parseX;
            this.template.textFields[this.selectedIndex].height = parseY;
        }
    }
    private setResizer = function (target: HTMLLIElement) {
        let targetRectangle = parseElementRectangle(target);
        this.resizerCoordinates.x = targetRectangle.left + targetRectangle.width;
        this.resizerCoordinates.y = targetRectangle.top + targetRectangle.height;
    }
    private sendToProcessing() {
        this.imageService.sendToProcessing(this.template).then(result => {
            window.open(result.text());
        });
    }
    private domtoimage() {
        domtoimage.toJpeg(this.printArea.nativeElement, { quality: 1 })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
    }
    private saveInServer() {
        this.imageService.saveInServer(this.template).then(result => {
            this.msgs.push({ severity: 'info', summary: 'נשמר', detail: '' });
        });
    }
    private showContextMenu = (event) => {
        this.contextmenu.show(event);
    };
}