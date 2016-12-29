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
var image_service_1 = require("../services/image.service");
var ng2_bootstrap_1 = require("ng2-bootstrap");
var ListComponent = (function () {
    function ListComponent(imageService, router) {
        this.imageService = imageService;
        this.router = router;
        this.name = 'About';
    }
    ListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageService.getImageNames().forEach(function (value) { return _this.imageList = value; });
    };
    ListComponent.prototype.openModal = function (image) {
        this.selectedImage = image;
        this.modal.show();
    };
    ListComponent.prototype.baseImageSelect = function (height, width) {
        this.modal.hide();
        this.router.navigate(['/details', this.selectedImage._id, height, width]);
    };
    return ListComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bootstrap_1.ModalDirective)
], ListComponent.prototype, "modal", void 0);
ListComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./list.html",
        providers: [image_service_1.ImageService],
        styles: [".image-item {height:200px;}\n              .image-item a h4 {height:20px;margin-top:5px;}"]
    }),
    __metadata("design:paramtypes", [image_service_1.ImageService,
        router_1.Router])
], ListComponent);
exports.ListComponent = ListComponent;
//# sourceMappingURL=list.component.js.map