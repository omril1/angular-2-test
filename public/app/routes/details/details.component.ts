﻿import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';
import { MenuItem, ContextMenu, Message } from 'primeng/primeng';
import { ImageService, ItextField, Template } from '../../services/image.service';
import * as utils from '../../utils';
let domtoimage = require('dom-to-image');

interface coordinates {
    x: number;
    y: number;
}

@Component({
    moduleId: module.id,
    templateUrl: "details.html",
    styleUrls: ["details.css"],
    providers: [ImageService],
})
export class DetailsComponent implements OnInit {
    @ViewChild('container') containerViewChild: HTMLDivElement;
    @ViewChild('contextmenu') contextmenu: ContextMenu;
    @ViewChild('printArea') printArea: ElementRef;
    // ~~~~~~~~~~~~ Global keyboard events ~~~~~~~~~
    //@HostListener('window:keydown', ['$event'])
    //keyboardInput(event: any) {
    //    console.log('keydown event fired', event);
    //    if (this.selectedField) {
    //        this.selectedField.left += 5;
    //    }
    //}

    // ~~~~~~~ focused element keyboard events ~~~~~~
    private keyUp(event) {
        console.log('keyup even fired', event);
    }
    @HostListener('window:resize', ['$event'])
    onResize(event) {
        let printArea = this.printArea.nativeElement;
        let nHeight = printArea.children[printArea.children.length - 1].naturalHeight
        let height = event.target.innerHeight - printArea.getBoundingClientRect().top;
        this.printArea.nativeElement.style.height = height + 'px';
        let aspectRation = nHeight / height;
        this.template.textFields = this.template.textFields.map(field => { field.top *= aspectRation; field.left *= aspectRation; field.width *= aspectRation; field.height *= aspectRation; return field; });
    }


    private mouseEvent: any[];
    private items: MenuItem[];
    private template: Template;
    private imageWidth: number;
    private imageHeight: number;
    private fieldsCounter = 0;
    private selectedIndex = -1;
    private color: string;
    private resizerCoordinates: coordinates = { x: 0, y: 0 };
    private msgs: Message[] = [];
    get selectedField(): ItextField {
        return this.template.textFields[this.selectedIndex];
    }
    //private fonts = ["Arial", "David Transparent", "Guttman Calligraphic", "Guttman David", "Guttman Stam", "Guttman Yad", "Guttman Yad-Brush", "Guttman-Aram", "Levenim MT", "Lucida Sans Unicode", "Microsoft Sans Serif", "Miriam Transparent", "Narkisim", "Tahoma"];
    private fonts = ["ABeeZee", "Abel", "Abhaya Libre", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amatica SC", "Amethysta", "Amiko", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arima Madurai", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Assistant", "Astloch", "Asul", "Athiti", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre"];
    private fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 32, 35, 36, 37, 38, 40, 42, 45, 48, 50, 52, 55];

    constructor(private route: ActivatedRoute, private imageService: ImageService) {
    }
    public ngOnInit() {
        this.route.params.subscribe(params => {
            //this.imageID = params['id'];
            this.imageService.getTemplate(params['id']).then(template => this.template = template, err => {
                console.error(err);
                this.template = null;
                this.msgs.push({ severity: 'warning', summary: 'תקלת תקשורת', detail: '' });
            });
            this.imageHeight = parseInt(params['height']);
            this.imageWidth = parseInt(params['width']);
        });
        this.items = [{
            label: 'Print',
            icon: 'fa-print',
            command: (event) => { }
        }];
    }

    private removeField(index?: number) {
        if (index != undefined)
            this.template.textFields.splice(index, 1);
        else if (this.selectedIndex != -1) {
            this.template.textFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    private addField() {
        this.template.textFields.push(<ItextField>{
            left: 1000 / 3,
            top: 30,
            width: 420,
            height: 60,
            text: "טקסט לבדיקת תצוגה",
            font: "Arial",
            fontSize: 42,
            bold: true,
            align: 'center',
            italic: false,
            underline: false,
            color: "#337ab7",
            index: this.fieldsCounter++,
            rotation: 0,
            stroke: { color: '#000000', width: 0 },
            shadow: { x: 0, y: 0, blur: -1, color: '#000000' },
            letterSpace: 0,
            wordSpace: 0
        });
    };
    private setProperty(propName: string, prop: any) {
        if (this.template && this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = prop;
        }
    };
    private hasProperty(propName: string, prop: any) {
        if (this.template && this.template.textFields[this.selectedIndex]) {
            return this.template.textFields[this.selectedIndex][propName] == prop;
        }
        else
            return false;
    };
    private toggleProperty(propName: string) {
        if (this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = !this.template.textFields[this.selectedIndex][propName];
        }
    }
    private selectField(fieldIndex: number, event: MouseEvent) {
        this.selectedIndex = fieldIndex;
        this.color = this.template.textFields[this.selectedIndex].color;
        this.setResizer(<HTMLLIElement>event.currentTarget);
    }
    private dragstart(fieldIndex: number, event: DragEvent) {
        this.selectedIndex = fieldIndex;
        this.color = this.template.textFields[this.selectedIndex].color;
        this.setResizer(<HTMLLIElement>event.currentTarget);

        (<HTMLLIElement>event.currentTarget).classList.add('dragged');
        utils.noGhostImage(event);
    }
    private dragend(event: DragEvent) {
        (<HTMLLIElement>event.currentTarget).classList.remove('dragged');
    }
    private onDrag(fieldIndex: number, event: any) {
        let targetRectangle = utils.parseElementRectangle(event.currentTarget);
        this.template.textFields[this.selectedIndex].left = targetRectangle.left;
        this.template.textFields[this.selectedIndex].top = targetRectangle.top;
    }
    private resizestart(event: DragEvent) {
        utils.noGhostImage(event);
    }
    private resize(event: DragEvent) {
        let targetRectangle = utils.parseElementRectangle(event.srcElement);
        let parseX = Math.max(Number(targetRectangle.left), 0);
        let parseY = Math.max(Number(targetRectangle.top), 0);

        this.template.textFields[this.selectedIndex].width = parseX;
        this.template.textFields[this.selectedIndex].height = parseY;
    }
    private setResizer(target: HTMLLIElement) {
        this.resizerCoordinates = { x: 0, y: 0 };
    }

    private rotate(event: DragEvent) {
        this.mouseEvent = [event.clientX, event.detail, event.offsetX, event.x];
        let targetRectangle = utils.parseElementRectangle(event.srcElement);
        //console.log(event.clientX, event.detail, event.offsetX, event.x);
        //console.log(event.srcElement.getBoundingClientRect());
        let {dx, dy} = { dx: targetRectangle.left - this.selectedField.width / 2, dy: targetRectangle.top - this.selectedField.height / 2 };
        let angle = -(180 * Math.atan2(dx, dy) / Math.PI);
        //round the angle to the nearest whole right angle if possible.
        angle = utils.roundAngle(angle, 7);
        this.template.textFields[this.selectedIndex].rotation = angle;
    }
    private rotatestart(event: DragEvent) {
        event.srcElement.classList.add('dragged');
        let {dx, dy} = { dx: this.selectedField.left + this.selectedField.width / 2, dy: this.selectedField.top + this.selectedField.height / 2 };
        //this.printArea.nativeElement.appendChild(utils.createLine(dx + event.offsetX, dy + event.offsetY, dx, dy));
    }
    private rotateend(event: DragEvent) {
        event.srcElement.classList.remove('dragged');
        (<HTMLElement>event.srcElement).style.left = null;
        (<HTMLElement>event.srcElement).style.top = null;
    }



    private sendToProcessing = function () {
        this.imageService.sendToProcessing(this.template).then(result => {
            window.open(result.text());
        });
    }
    private domtoimage = function () {
        domtoimage.toJpeg(this.printArea.nativeElement, { quality: 1 })
            .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
    }
    private saveInServer = function () {
        this.imageService.saveInServer(this.template).then(result => {
            this.msgs.push({ severity: 'info', summary: 'נשמר', detail: '' });
        });
    }
    private showContextMenu = (event) => {
        this.contextmenu.show(event);
    };
}