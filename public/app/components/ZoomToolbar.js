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
var ZoomToolbarComponent = (function () {
    function ZoomToolbarComponent() {
        this.zoomLevels = [.2, .3, .4, .5, .6, .7, .8, .9, 1, 1.2, 1.5, 1.75, 2, 4];
        this.zoomIndex = 8;
        this.zoomChanged = new core_1.EventEmitter(false);
    }
    ZoomToolbarComponent.prototype.zoomIn = function () {
        if (this.zoomIndex < this.zoomLevels.length - 1) {
            this.zoomIndex++;
            this.zoomChanged.emit(this.zoomLevels[this.zoomIndex]);
        }
    };
    ZoomToolbarComponent.prototype.zoomOut = function () {
        if (this.zoomIndex > 0) {
            this.zoomIndex--;
            this.zoomChanged.emit(this.zoomLevels[this.zoomIndex]);
        }
    };
    return ZoomToolbarComponent;
}());
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], ZoomToolbarComponent.prototype, "zoomChanged", void 0);
ZoomToolbarComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'zoom-toolbar',
        templateUrl: 'zoomToolbar.html',
        styles: ["\n        :host { position:fixed;bottom:0;right:0;margin:0px 15px 40px 0;-ms-zoom:reset;zoom:reset;opacity:0.4;transition:opacity 0.5s ease;z-index:1000; }\n        :host:hover { opacity:1 }\n        .zoom-buttons { display: block;float:right;margin-bottom:5px; }\n        .zoom-buttons button { width:30px;height:30px;border-radius:50%;margin:2px;outline:none }\n    "]
    }),
    __metadata("design:paramtypes", [])
], ZoomToolbarComponent);
exports.ZoomToolbarComponent = ZoomToolbarComponent;
//# sourceMappingURL=zoomToolbar.js.map