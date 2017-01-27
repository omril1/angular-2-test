"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var router_1 = require("@angular/router");
//import { Message } from 'primeng/primeng';
var image_service_1 = require("../../services/image.service");
var auth_service_1 = require("../../services/auth.service");
var messages_service_1 = require("../../services/messages.service");
var utils = require("../../utils");
var domtoimage = require('dom-to-image');
var DetailsComponent = (function () {
    function DetailsComponent(route, imageService, sanitizer, auth, messages) {
        this.route = route;
        this.imageService = imageService;
        this.sanitizer = sanitizer;
        this.auth = auth;
        this.messages = messages;
        this.zoomLevel = 1;
        this.fieldsCounter = 0;
        this.selectedIndex = -1;
        //private msgs: Message[] = [];
        //english only fonts that start with A from google font api:
        //private fonts = ["ABeeZee", "Abel", "Abhaya Libre", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amatica SC", "Amethysta", "Amiko", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arima Madurai", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Assistant", "Astloch", "Asul", "Athiti", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre"];
        //hebrew fonts:
        this.fonts = ['Arimo', 'Varela Round', 'Rubik', 'Amatic SC', 'Heebo', 'Cousine', 'Tinos', 'Frank Ruhl Libre', 'Alef', 'Assistant', 'Suez One', 'Secular One', 'Amatica SC', 'David Libre', 'Miriam Libre'];
        this.fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 32, 35, 36, 37, 38, 40, 42, 45, 48, 50, 52, 55];
    }
    Object.defineProperty(DetailsComponent.prototype, "selectedField", {
        get: function () {
            return this.template.moveableFields[this.selectedIndex];
        },
        enumerable: true,
        configurable: true
    });
    DetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.pdfURL = _this.sanitizer.bypassSecurityTrustResourceUrl('/imageapi/dummypdf/' + params['id'] + '.pdf');
            _this.imageService.getTemplate(params['id']).then(function (template) { _this.template = template; }, function (err) {
                console.error(err);
                _this.template = null;
                //this.msgs.push({ severity: 'warning', summary: 'תקלת תקשורת', detail: '' });
                _this.messages.error('תקלת תקשורת');
            });
            //let pageSizes = this.imageService.pageSizes['A4']
        });
    };
    DetailsComponent.prototype.removeField = function (index) {
        if (index != undefined)
            this.template.moveableFields.splice(index, 1);
        else if (this.selectedIndex != -1) {
            this.template.moveableFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    ;
    DetailsComponent.prototype.addField = function () {
        this.template.moveableFields.push({
            left: this.template.width / 4,
            top: this.template.height / 22,
            width: this.template.height / 2,
            height: this.template.width / 18,
            text: "טקסט לבדיקת תצוגה",
            font: "Arial",
            fontSize: this.template.width / 19,
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
    ;
    DetailsComponent.prototype.addImageFromPanel = function (item) {
        //translate to printArea's coordinate system:
        var left = item.x - this.printArea.nativeElement.getBoundingClientRect().left;
        var top = item.y - this.printArea.nativeElement.getBoundingClientRect().top;
        this.template.moveableFields.push({
            left: left / this.zoomLevel,
            top: top / this.zoomLevel,
            width: item.width / this.zoomLevel,
            height: item.height / this.zoomLevel,
            imageId: item._id,
            rotation: 0,
            isImage: true
        });
    };
    DetailsComponent.prototype.getFieldRotationSanitized = function (field) {
        return this.sanitizer.bypassSecurityTrustStyle('rotateZ(' + field.rotation + 'deg)');
    };
    DetailsComponent.prototype.getPrintAreaWidthSanitized = function () {
        return this.sanitizer.bypassSecurityTrustStyle('calc(50% - ' + (this.template.width * this.zoomLevel / 2) + 'px)');
    };
    DetailsComponent.prototype.getStyle = function (field, index) {
        if (field.isImage) {
            return {
                'left': field.left * this.zoomLevel + "px",
                'top': field.top * this.zoomLevel + "px",
                'width': field.width * this.zoomLevel + "px",
                'height': field.height * this.zoomLevel + "px",
                'transform': 'rotateZ(' + field.rotation + 'deg)',
                'z-index': (index == this.selectedIndex ? 400 : 100) + index
            };
        }
        else {
            var textShadow = field.shadow.blur != -1 ? field.shadow.x + 'px ' + field.shadow.y + 'px ' + field.shadow.blur + 'px ' + field.shadow.color : 'none';
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
    };
    DetailsComponent.prototype.setProperty = function (propName, prop) {
        if (this.template && this.selectedField) {
            this.selectedField[propName] = prop;
        }
    };
    ;
    DetailsComponent.prototype.hasProperty = function (propName, prop) {
        if (this.template && this.selectedField) {
            return this.selectedField[propName] == prop;
        }
        else
            return false;
    };
    ;
    DetailsComponent.prototype.toggleProperty = function (propName) {
        if (this.selectedField) {
            this.selectedField[propName] = !this.selectedField[propName];
        }
    };
    DetailsComponent.prototype.dragStart = function (fieldIndex, event) {
        this.selectedIndex = fieldIndex;
        event.currentTarget.classList.add('dragged');
        utils.noGhostImage(event);
    };
    DetailsComponent.prototype.dragEnd = function (event) {
        event.currentTarget.classList.remove('dragged');
    };
    DetailsComponent.prototype.onDrag = function (fieldIndex, event) {
        this.selectedField.left = Number(event.currentTarget.style.left.replace('px', '')) / this.zoomLevel;
        this.selectedField.top = Number(event.currentTarget.style.top.replace('px', '')) / this.zoomLevel;
    };
    DetailsComponent.prototype.resizeStart = function (event) {
        utils.noGhostImage(event);
    };
    DetailsComponent.prototype.onResize = function (event) {
        var parseX = Math.max(Number(event.currentTarget.style.left.replace('px', '')), 0) / this.zoomLevel;
        var parseY = Math.max(Number(event.currentTarget.style.top.replace('px', '')), 0) / this.zoomLevel;
        this.selectedField.width = parseX;
        this.selectedField.height = parseY;
    };
    DetailsComponent.prototype.resizeEnd = function (event) {
        //(<HTMLElement>event.srcElement).style.left = null;
        //(<HTMLElement>event.srcElement).style.top = null;
    };
    DetailsComponent.prototype.onRotate = function (event) {
        this.rotate(event);
        //the last event on rotation emits mouse position of 0,0. might be a bug.
    };
    DetailsComponent.prototype.rotateStart = function (event) {
        event.srcElement.classList.add('dragged');
        this.rotationCenter = {
            x: this.printArea.nativeElement.getBoundingClientRect().left + this.selectedField.left * this.zoomLevel + this.selectedField.width * this.zoomLevel / 2,
            y: this.printArea.nativeElement.getBoundingClientRect().top + this.selectedField.top * this.zoomLevel + this.selectedField.height * this.zoomLevel / 2
        };
    };
    DetailsComponent.prototype.rotateEnd = function (event) {
        event.srcElement.classList.remove('dragged');
        this.rotate(event);
        event.srcElement.style.left = null;
        event.srcElement.style.top = null;
    };
    DetailsComponent.prototype.rotate = function (event) {
        var _a = { dx: event.x - this.rotationCenter.x, dy: event.y - this.rotationCenter.y }, dx = _a.dx, dy = _a.dy;
        var angle = -(180 * Math.atan2(dx, dy) / Math.PI);
        //round the angle to the nearest whole right angle if possible.
        angle = utils.roundAngle(angle, 7);
        this.selectedField.rotation = angle;
    };
    DetailsComponent.prototype.sendToProcessing = function () {
        var _this = this;
        //this.imageService.sendToProcessing(this.template).then(result => {
        //    window.open(result.text());
        //});
        this.imageService.saveInServer(this.template).then(function (result) {
            window.open('/imageapi/dummypdf/' + _this.template._id + '.pdf');
        }, function (err) {
            //this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
            _this.messages.error('תקלת תקשורת');
        });
    };
    DetailsComponent.prototype.domtoimage = function () {
        domtoimage.toJpeg(this.printArea.nativeElement, {
            quality: 1, filter: function (node) {
                var result = true;
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
    };
    DetailsComponent.prototype.saveInServer = function () {
        var _this = this;
        this.imageService.saveInServer(this.template).then(function (result) {
            _this.messages.success('נשמר');
            //this.msgs.push({ severity: 'info', summary: 'נשמר', detail: '' });
        }, function (err) {
            _this.messages.error('תקלת תקשורת');
            //this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
        });
    };
    return DetailsComponent;
}());
__decorate([
    core_1.ViewChild('printArea'),
    __metadata("design:type", core_1.ElementRef)
], DetailsComponent.prototype, "printArea", void 0);
DetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "details.html",
        styleUrls: ["details.css"],
        providers: [image_service_1.ImageService],
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, image_service_1.ImageService, platform_browser_1.DomSanitizer, auth_service_1.Auth, messages_service_1.Messages])
], DetailsComponent);
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=index.js.map