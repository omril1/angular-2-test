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
var primeng_1 = require("primeng/primeng");
var image_service_1 = require("../../services/image.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var utils = require("../../utils");
var domtoimage = require('dom-to-image');
var DetailsComponent = (function () {
    function DetailsComponent(route, imageService, sanitizer) {
        this.route = route;
        this.imageService = imageService;
        this.sanitizer = sanitizer;
        this.zoomLevel = 1;
        this.fieldsCounter = 0;
        this.selectedIndex = -1;
        this.msgs = [];
        this.fonts = ["ABeeZee", "Abel", "Abhaya Libre", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amatica SC", "Amethysta", "Amiko", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arima Madurai", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Assistant", "Astloch", "Asul", "Athiti", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre"];
        this.fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 32, 35, 36, 37, 38, 40, 42, 45, 48, 50, 52, 55];
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/imageapi/upload",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: false,
            maxFileSize: 3 * 1024 * 1024,
            autoUpload: false
        });
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
            //this.imageID = params['id'];
            _this.imageService.getTemplate(params['id']).then(function (template) { return _this.template = template; }, function (err) {
                console.error(err);
                _this.template = null;
                _this.msgs.push({ severity: 'warning', summary: 'תקלת תקשורת', detail: '' });
            });
            var pageSizes = _this.imageService.pageSizes[params['pageSize']];
            _this.imageHeight = pageSizes.height;
            _this.imageWidth = pageSizes.width;
        });
        this.items = [{
                label: 'Print',
                icon: 'fa-print',
                command: function (event) { }
            }];
        this.uploader.onAfterAddingFile = function (fileItem) {
            fileItem.previewUrl = _this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
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
    ;
    DetailsComponent.prototype.getStyle = function (field, index) {
        if (field.isImage) {
            return {
                'left': field.left * this.zoomLevel + "px",
                'top': field.top * this.zoomLevel + "px",
                'width': field.width * this.zoomLevel + "px",
                'height': field.height * this.zoomLevel + "px",
                'transform': 'rotateZ(' + field.rotation + 'deg)',
                'z-index': (index == this.selectedIndex ? 400 : 100) + index,
                'background-image': 'url(/imageapi/byid/' + field.imageId + ')',
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
        this.debugValue = [this.rotationCenter, event.x, event.y];
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
    DetailsComponent.prototype.zoomChange = function (zoomLevel) {
        this.zoomLevel = zoomLevel;
    };
    DetailsComponent.prototype.sendToProcessing = function () {
        var _this = this;
        //this.imageService.sendToProcessing(this.template).then(result => {
        //    window.open(result.text());
        //});
        this.imageService.saveInServer(this.template).then(function (result) {
            window.open('/imageapi/dummypdf/' + _this.template._id + '.pdf');
        }, function (err) {
            _this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
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
            _this.msgs.push({ severity: 'info', summary: 'נשמר', detail: '' });
        }, function (err) {
            _this.msgs.push({ severity: 'error', summary: 'תקלת תקשורת', detail: '' });
        });
    };
    DetailsComponent.prototype.showContextMenu = function (event) {
        this.contextmenu.show(event);
    };
    ;
    return DetailsComponent;
}());
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", HTMLDivElement)
], DetailsComponent.prototype, "containerViewChild", void 0);
__decorate([
    core_1.ViewChild('contextmenu'),
    __metadata("design:type", primeng_1.ContextMenu)
], DetailsComponent.prototype, "contextmenu", void 0);
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
    __metadata("design:paramtypes", [router_1.ActivatedRoute, image_service_1.ImageService, platform_browser_1.DomSanitizer])
], DetailsComponent);
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=details.component.js.map