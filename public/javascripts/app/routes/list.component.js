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
var image_service_1 = require("../services/image.service");
var ListComponent = (function () {
    function ListComponent(imageService) {
        var _this = this;
        this.imageService = imageService;
        this.name = 'About';
        this.imageService.getImageNames().forEach(function (value) { return _this.imageList = value; });
    }
    return ListComponent;
}());
ListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "/html-routes/list.html",
        providers: [image_service_1.ImageService],
        styles: [".image-item {height:200px;}\n              .image-item a h4 {height:20px;margin-top:5px;}"]
    }),
    __metadata("design:paramtypes", [image_service_1.ImageService])
], ListComponent);
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map