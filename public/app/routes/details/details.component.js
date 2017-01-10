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
var router_1 = require("@angular/router");
var primeng_1 = require("primeng/primeng");
var image_service_1 = require("../../services/image.service");
var utils = require("../../utils");
var domtoimage = require('dom-to-image');
var DetailsComponent = (function () {
    function DetailsComponent(route, imageService) {
        var _this = this;
        this.route = route;
        this.imageService = imageService;
        this.fieldsCounter = 0;
        this.selectedIndex = -1;
        this.resizerCoordinates = { x: 0, y: 0 };
        this.msgs = [];
        //private fonts = ["Arial", "David Transparent", "Guttman Calligraphic", "Guttman David", "Guttman Stam", "Guttman Yad", "Guttman Yad-Brush", "Guttman-Aram", "Levenim MT", "Lucida Sans Unicode", "Microsoft Sans Serif", "Miriam Transparent", "Narkisim", "Tahoma"];
        this.fonts = ["ABeeZee", "Abel", "Abhaya Libre", "Abril Fatface", "Aclonica", "Acme", "Actor", "Adamina", "Advent Pro", "Aguafina Script", "Akronim", "Aladin", "Aldrich", "Alef", "Alegreya", "Alegreya SC", "Alegreya Sans", "Alegreya Sans SC", "Alex Brush", "Alfa Slab One", "Alice", "Alike", "Alike Angular", "Allan", "Allerta", "Allerta Stencil", "Allura", "Almendra", "Almendra Display", "Almendra SC", "Amarante", "Amaranth", "Amatic SC", "Amatica SC", "Amethysta", "Amiko", "Amiri", "Amita", "Anaheim", "Andada", "Andika", "Angkor", "Annie Use Your Telescope", "Anonymous Pro", "Antic", "Antic Didone", "Antic Slab", "Anton", "Arapey", "Arbutus", "Arbutus Slab", "Architects Daughter", "Archivo Black", "Archivo Narrow", "Aref Ruqaa", "Arima Madurai", "Arimo", "Arizonia", "Armata", "Artifika", "Arvo", "Arya", "Asap", "Asar", "Asset", "Assistant", "Astloch", "Asul", "Athiti", "Atma", "Atomic Age", "Aubrey", "Audiowide", "Autour One", "Average", "Average Sans", "Averia Gruesa Libre", "Averia Libre"];
        this.fontSizes = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 26, 29, 32, 35, 36, 37, 38, 40, 42, 45, 48, 50, 52, 55];
        this.sendToProcessing = function () {
            this.imageService.sendToProcessing(this.template).then(function (result) {
                window.open(result.text());
            });
        };
        this.domtoimage = function () {
            domtoimage.toJpeg(this.printArea.nativeElement, { quality: 1 })
                .then(function (dataUrl) {
                var link = document.createElement('a');
                link.download = 'my-image-name.jpeg';
                link.href = dataUrl;
                link.click();
            });
        };
        this.saveInServer = function () {
            var _this = this;
            this.imageService.saveInServer(this.template).then(function (result) {
                _this.msgs.push({ severity: 'info', summary: 'נשמר', detail: '' });
            });
        };
        this.showContextMenu = function (event) {
            _this.contextmenu.show(event);
        };
    }
    // ~~~~~~~~~~~~ Global keyboard events ~~~~~~~~~
    //@HostListener('window:keydown', ['$event'])
    //keyboardInput(event: any) {
    //    console.log('keydown event fired', event);
    //    if (this.selectedField) {
    //        this.selectedField.left += 5;
    //    }
    //}
    // ~~~~~~~ focused element keyboard events ~~~~~~
    DetailsComponent.prototype.keyUp = function (event) {
        console.log('keyup even fired', event);
    };
    DetailsComponent.prototype.onResize = function (event) {
        var printArea = this.printArea.nativeElement;
        var nHeight = printArea.children[printArea.children.length - 1].naturalHeight;
        var height = event.target.innerHeight - printArea.getBoundingClientRect().top;
        this.printArea.nativeElement.style.height = height + 'px';
        var aspectRation = nHeight / height;
        this.template.textFields = this.template.textFields.map(function (field) { field.top *= aspectRation; field.left *= aspectRation; field.width *= aspectRation; field.height *= aspectRation; return field; });
    };
    Object.defineProperty(DetailsComponent.prototype, "selectedField", {
        get: function () {
            return this.template.textFields[this.selectedIndex];
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
            _this.imageHeight = parseInt(params['height']);
            _this.imageWidth = parseInt(params['width']);
        });
        this.items = [{
                label: 'Print',
                icon: 'fa-print',
                command: function (event) { }
            }];
    };
    DetailsComponent.prototype.removeField = function (index) {
        if (index != undefined)
            this.template.textFields.splice(index, 1);
        else if (this.selectedIndex != -1) {
            this.template.textFields.splice(this.selectedIndex, 1);
            this.selectedIndex = -1;
        }
    };
    ;
    DetailsComponent.prototype.addField = function () {
        this.template.textFields.push({
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
    ;
    DetailsComponent.prototype.setProperty = function (propName, prop) {
        if (this.template && this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = prop;
        }
    };
    ;
    DetailsComponent.prototype.hasProperty = function (propName, prop) {
        if (this.template && this.template.textFields[this.selectedIndex]) {
            return this.template.textFields[this.selectedIndex][propName] == prop;
        }
        else
            return false;
    };
    ;
    DetailsComponent.prototype.toggleProperty = function (propName) {
        if (this.template.textFields[this.selectedIndex]) {
            this.template.textFields[this.selectedIndex][propName] = !this.template.textFields[this.selectedIndex][propName];
        }
    };
    DetailsComponent.prototype.selectField = function (fieldIndex, event) {
        this.selectedIndex = fieldIndex;
        this.color = this.template.textFields[this.selectedIndex].color;
        this.setResizer(event.currentTarget);
    };
    DetailsComponent.prototype.dragstart = function (fieldIndex, event) {
        this.selectedIndex = fieldIndex;
        this.color = this.template.textFields[this.selectedIndex].color;
        this.setResizer(event.currentTarget);
        event.currentTarget.classList.add('dragged');
        utils.noGhostImage(event);
    };
    DetailsComponent.prototype.dragend = function (event) {
        event.currentTarget.classList.remove('dragged');
    };
    DetailsComponent.prototype.onDrag = function (fieldIndex, event) {
        var targetRectangle = utils.parseElementRectangle(event.currentTarget);
        this.template.textFields[this.selectedIndex].left = targetRectangle.left;
        this.template.textFields[this.selectedIndex].top = targetRectangle.top;
    };
    DetailsComponent.prototype.resizestart = function (event) {
        utils.noGhostImage(event);
    };
    DetailsComponent.prototype.resize = function (event) {
        var targetRectangle = utils.parseElementRectangle(event.srcElement);
        var parseX = Math.max(Number(targetRectangle.left), 0);
        var parseY = Math.max(Number(targetRectangle.top), 0);
        this.template.textFields[this.selectedIndex].width = parseX;
        this.template.textFields[this.selectedIndex].height = parseY;
    };
    DetailsComponent.prototype.setResizer = function (target) {
        this.resizerCoordinates = { x: 0, y: 0 };
    };
    DetailsComponent.prototype.rotate = function (event) {
        this.mouseEvent = [event.clientX, event.detail, event.offsetX, event.x];
        var targetRectangle = utils.parseElementRectangle(event.srcElement);
        //console.log(event.clientX, event.detail, event.offsetX, event.x);
        //console.log(event.srcElement.getBoundingClientRect());
        var _a = { dx: targetRectangle.left - this.selectedField.width / 2, dy: targetRectangle.top - this.selectedField.height / 2 }, dx = _a.dx, dy = _a.dy;
        var angle = -(180 * Math.atan2(dx, dy) / Math.PI);
        //round the angle to the nearest whole right angle if possible.
        angle = utils.roundAngle(angle, 7);
        this.template.textFields[this.selectedIndex].rotation = angle;
    };
    DetailsComponent.prototype.rotatestart = function (event) {
        event.srcElement.classList.add('dragged');
        var _a = { dx: this.selectedField.left + this.selectedField.width / 2, dy: this.selectedField.top + this.selectedField.height / 2 }, dx = _a.dx, dy = _a.dy;
        //this.printArea.nativeElement.appendChild(utils.createLine(dx + event.offsetX, dy + event.offsetY, dx, dy));
    };
    DetailsComponent.prototype.rotateend = function (event) {
        event.srcElement.classList.remove('dragged');
        event.srcElement.style.left = null;
        event.srcElement.style.top = null;
    };
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
__decorate([
    core_1.HostListener('window:resize', ['$event']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], DetailsComponent.prototype, "onResize", null);
DetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "details.html",
        styleUrls: ["details.css"],
        providers: [image_service_1.ImageService],
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, image_service_1.ImageService])
], DetailsComponent);
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=details.component.js.map