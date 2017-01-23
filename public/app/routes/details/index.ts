import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/observable';
import { Draggable } from 'ng2-draggable';
import { Message } from 'primeng/primeng';
import { ImageService, moveableField, Template } from '../../services/image.service';
import { Auth } from '../../services/auth.service';
import * as utils from '../../utils';
let domtoimage = require('dom-to-image');

@Component({
    moduleId: module.id,
    templateUrl: "details.html",
    styleUrls: ["details.css"],
    providers: [ImageService],
})
export class DetailsComponent implements OnInit {
    @ViewChild('printArea') printArea: ElementRef;

    private template: Template;
    private imageWidth: number;
    private imageHeight: number;
    private zoomLevel: number = 1;
    private pdfURL: SafeResourceUrl;
    private fieldsCounter = 0;
    private selectedIndex = -1;
    private rotationCenter: { x: number, y: number };
    private msgs: Message[] = [];
    //english only fonts that start with A from google font api:
    //private fonts = ["ABeeZee", "Abel", "Abhaya Libre", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amatica SC", "Amethysta", "Amiko", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arima Madurai", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Assistant", "Astloch", "Asul", "Athiti", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre"];
    //hebrew fonts:
    private fonts = ['Arimo', 'Varela Round', 'Rubik', 'Amatic SC', 'Heebo', 'Cousine', 'Tinos', 'Frank Ruhl Libre', 'Alef', 'Assistant', 'Suez One', 'Secular One', 'Amatica SC', 'David Libre', 'Miriam Libre'];
    private fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 32, 35, 36, 37, 38, 40, 42, 45, 48, 50, 52, 55];

    get selectedField(): moveableField {
        return this.template.moveableFields[this.selectedIndex];
    }

    constructor(private route: ActivatedRoute, private imageService: ImageService, private sanitizer: DomSanitizer, private auth: Auth) {
    }
    public ngOnInit() {
        this.route.params.subscribe(params => {
            this.pdfURL = this.sanitizer.bypassSecurityTrustResourceUrl('/imageapi/dummypdf/' + params['id'] + '.pdf');
            this.imageService.getTemplate(params['id']).then(template => this.template = template, err => {
                console.error(err);
                this.template = null;
                this.msgs.push({ severity: 'warning', summary: 'תקלת תקשורת', detail: '' });
            });
            let pageSizes = this.imageService.pageSizes[params['pageSize']]
            this.imageHeight = pageSizes.height;
            this.imageWidth = pageSizes.width;
        });
    }

    private removeField(index?: number) {
        if (index != undefined)
            this.template.moveableFields.splice(index, 1);
        else if (this.selectedIndex != -1) {
            this.template.moveableFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    private addField() {
        this.template.moveableFields.push(<moveableField>{
            left: this.imageWidth / 4,
            top: this.imageHeight / 22,
            width: this.imageWidth / 2,
            height: this.imageHeight / 20,
            text: "טקסט לבדיקת תצוגה",
            font: "Arial",
            fontSize: this.imageWidth / 19,
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
            wordSpace: 0,
            isImage: false
        });
    };
    private addImageFromPanel(item) {
        //translate to printArea's coordinate system:
        let left = item.x - this.printArea.nativeElement.getBoundingClientRect().left;
        let top = item.y - this.printArea.nativeElement.getBoundingClientRect().top;

        this.template.moveableFields.push({
            left: left / this.zoomLevel,
            top: top / this.zoomLevel,
            width: item.width / this.zoomLevel,
            height: item.height / this.zoomLevel,
            imageId: item._id,
            rotation: 0,
            isImage: true
        });
    }
    private getFieldRotationSanitized(field: moveableField) {
        return this.sanitizer.bypassSecurityTrustStyle('rotateZ(' + field.rotation + 'deg)');
    }
    private getPrintAreaWidthSanitized() {
        return this.sanitizer.bypassSecurityTrustStyle('calc(50% - ' + (this.imageWidth * this.zoomLevel / 2) + 'px)');
    }
    private getStyle(field: moveableField, index: number) {
        if (field.isImage) {
            return {
                'left': field.left * this.zoomLevel + "px",
                'top': field.top * this.zoomLevel + "px",
                'width': field.width * this.zoomLevel + "px",
                'height': field.height * this.zoomLevel + "px",
                'transform': 'rotateZ(' + field.rotation + 'deg)',
                'z-index': (index == this.selectedIndex ? 400 : 100) + index
            }
        }
        else {
            let textShadow = field.shadow.blur != -1 ? field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px ' + field.shadow.color : 'none';
            return {
                'left': field.left * this.zoomLevel + "px",
                'top': field.top * this.zoomLevel + "px",
                'width': field.width * this.zoomLevel + "px",
                'height': field.height * this.zoomLevel + "px",
                'transform': 'rotateZ(' + field.rotation + 'deg)',
                'z-index': (index == this.selectedIndex ? 400 : 200) + index,
                'font-size': field.fontSize * this.zoomLevel + "px",
                'word-spacing': field.wordSpace * this.zoomLevel + "px",
                'letter-spacing': field.letterSpace * this.zoomLevel + "px",
                '-webkit-user-modify': index == this.selectedIndex ? 'read-write-plaintext-only' : 'unset',
                'color': field.color,
                'font-family': field.font,
                'font-weight': field.bold ? 'bold' : 'normal',
                'font-style': field.italic ? 'italic' : 'normal',
                'text-decoration': field.underline ? 'underline' : 'none',
                'text-align': field.align,
                '-webkit-text-stroke-color': field.stroke.color,
                '-webkit-text-stroke-width': field.stroke.width / 10 + "px",
                'text-shadow': textShadow
            };
        }
    }
    private setProperty(propName: string, prop: any) {
        if (this.template && this.selectedField) {
            this.selectedField[propName] = prop;
        }
    };
    private hasProperty(propName: string, prop: any) {
        if (this.template && this.selectedField) {
            return this.selectedField[propName] == prop;
        }
        else
            return false;
    };
    private toggleProperty(propName: string) {
        if (this.selectedField) {
            this.selectedField[propName] = !this.selectedField[propName];
        }
    }
    private dragStart(fieldIndex: number, event: DragEvent) {
        this.selectedIndex = fieldIndex;

        (<HTMLLIElement>event.currentTarget).classList.add('dragged');
        utils.noGhostImage(event);
    }
    private dragEnd(event: DragEvent) {
        (<HTMLLIElement>event.currentTarget).classList.remove('dragged');
    }
    private onDrag(fieldIndex: number, event: DragEvent) {
        this.selectedField.left = Number((<HTMLElement>event.currentTarget).style.left.replace('px', '')) / this.zoomLevel;
        this.selectedField.top = Number((<HTMLElement>event.currentTarget).style.top.replace('px', '')) / this.zoomLevel;
    }
    private resizeStart(event: DragEvent) {
        utils.noGhostImage(event);
    }
    private onResize(event: DragEvent) {
        let parseX = Math.max(Number((<HTMLElement>event.currentTarget).style.left.replace('px', '')), 0) / this.zoomLevel;
        let parseY = Math.max(Number((<HTMLElement>event.currentTarget).style.top.replace('px', '')), 0) / this.zoomLevel;

        this.selectedField.width = parseX;
        this.selectedField.height = parseY;
    }
    private resizeEnd(event: DragEvent) {
        //(<HTMLElement>event.srcElement).style.left = null;
        //(<HTMLElement>event.srcElement).style.top = null;
    }
    private onRotate(event: DragEvent) {
        this.rotate(event);
        //the last event on rotation emits mouse position of 0,0. might be a bug.
    }
    private rotateStart(event: DragEvent) {
        event.srcElement.classList.add('dragged');
        this.rotationCenter = {
            x: this.printArea.nativeElement.getBoundingClientRect().left + this.selectedField.left * this.zoomLevel + this.selectedField.width * this.zoomLevel / 2,
            y: this.printArea.nativeElement.getBoundingClientRect().top + this.selectedField.top * this.zoomLevel + this.selectedField.height * this.zoomLevel / 2
        };
    }
    private rotateEnd(event: DragEvent) {
        event.srcElement.classList.remove('dragged');
        this.rotate(event);
        (<HTMLElement>event.srcElement).style.left = null;
        (<HTMLElement>event.srcElement).style.top = null;
    }
    private rotate(event) {
        let {dx, dy} = { dx: event.x - this.rotationCenter.x, dy: event.y - this.rotationCenter.y };
        let angle = -(180 * Math.atan2(dx, dy) / Math.PI);
        //round the angle to the nearest whole right angle if possible.
        angle = utils.roundAngle(angle, 7);
        this.selectedField.rotation = angle;
    }

    private sendToProcessing() {
        //this.imageService.sendToProcessing(this.template).then(result => {
        //    window.open(result.text());
        //});
        this.imageService.saveInServer(this.template).then(result => {
            window.open('/imageapi/dummypdf/' + this.template._id + '.pdf');
        }, err => {
            this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
        });
    }
    private domtoimage() {
        domtoimage.toJpeg(this.printArea.nativeElement, {
            quality: 1, filter: node => {
                let result = true;
                if (node.classList)
                    result = !node.classList.contains('inTemplate-tools');
                return result;
            }
        })
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
        }, err => {
            this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
        });
    }
}