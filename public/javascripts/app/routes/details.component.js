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
var image_service_1 = require("../services/image.service");
var parseElementRectangle = function (target) {
    return {
        left: Number(target.style.left.replace('px', '')),
        top: Number(target.style.top.replace('px', '')),
        width: Number(target.style.width.replace('px', '')),
        height: Number(target.style.height.replace('px', '')),
    };
};
var DetailsComponent = (function () {
    function DetailsComponent(route, imageService) {
        var _this = this;
        this.route = route;
        this.imageService = imageService;
        this.textFields = Array();
        this.fieldsCounter = 0;
        this.selectedIndex = -1;
        this.resizerCoordinates = { x: 0, y: 0 };
        this.fonts = ["Arial", "David Transparent", "Guttman Calligraphic", "Guttman David", "Guttman Stam", "Guttman Yad", "Guttman Yad-Brush", "Guttman-Aram", "Levenim MT", "Lucida Sans Unicode", "Microsoft Sans Serif", "Miriam Transparent", "Narkisim", "Tahoma"];
        this.removeField = function () {
            if (this.selectedIndex != -1) {
                this.textFields.splice(this.selectedIndex, 1);
                this.selectedIndex = -1;
            }
        };
        this.colorChanged = function (color) {
            this.color = color;
            if (this.selectedIndex != -1) {
                this.textFields[this.selectedIndex].color = color;
            }
        };
        this.addField = function () {
            this.textFields.push({
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
        this.setProperty = function (propName, prop) {
            if (this.textFields[this.selectedIndex]) {
                this.textFields[this.selectedIndex][propName] = prop;
            }
        };
        this.hasProperty = function (propName, prop) {
            if (this.textFields[this.selectedIndex]) {
                return this.textFields[this.selectedIndex][propName] == prop;
            }
            else
                return false;
        };
        this.toggleProperty = function (propName) {
            if (this.textFields[this.selectedIndex]) {
                this.textFields[this.selectedIndex][propName] = !this.textFields[this.selectedIndex][propName];
            }
        };
        this.dragstart = function (fieldIndex, event) {
            this.selectedIndex = fieldIndex;
            this.color = this.textFields[this.selectedIndex].color;
            this.setResizer(event.target);
        };
        this.onDrag = function (fieldIndex, event) {
            var targetRectangle = parseElementRectangle(event.target);
            this.textFields[this.selectedIndex].left = targetRectangle.left;
            this.textFields[this.selectedIndex].top = targetRectangle.top;
            this.setResizer(event.target);
        };
        this.resize = function (event) {
            var targetRectangle = parseElementRectangle(event.srcElement);
            var parseX = Number(targetRectangle.left) - this.textFields[this.selectedIndex].left;
            var parseY = Number(targetRectangle.top) - this.textFields[this.selectedIndex].top;
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
        };
        this.setResizer = function (target) {
            var targetRectangle = parseElementRectangle(target);
            this.resizerCoordinates.x = targetRectangle.left + targetRectangle.width;
            this.resizerCoordinates.y = targetRectangle.top + targetRectangle.height;
        };
        this.showContextMenu = function (event) {
            _this.contextmenu.show(event);
        };
    }
    DetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.imageID = params['id'];
            _this.imageHeight = parseInt(params['height']);
            _this.imageWidth = parseInt(params['width']);
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
                command: function (event) {
                }
            }
        ];
    };
    DetailsComponent.prototype.ngAfterViewInit = function () {
    };
    DetailsComponent.prototype.ngOnDestroy = function () {
    };
    DetailsComponent.prototype.sendToProcessing = function () {
        this.imageService.sendToProcessing({ ID: this.imageID, textFields: this.textFields }).then(function (result) {
            window.open(result.text());
        });
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
DetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./details.html",
        providers: [image_service_1.ImageService],
        styles: ["\n    .textField {\n        border-width: 1px;\n        border-style: dashed;\n        cursor: pointer;\n        line-height: normal;\n        overflow: hidden;\n    }\n\n    i.square-tile {\n        position: inherit;\n        width: 5px;\n        height: 5px;\n        border: solid 1px black;\n        background: white;\n        cursor: nw-resize;\n    }"],
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute, image_service_1.ImageService])
], DetailsComponent);
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=details.component.js.map