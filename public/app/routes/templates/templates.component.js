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
var image_service_1 = require("../../services/image.service");
var ng2_bootstrap_1 = require("ng2-bootstrap");
var TemplatesComponent = (function () {
    function TemplatesComponent(imageService, router) {
        this.imageService = imageService;
        this.router = router;
    }
    TemplatesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageService.getTemplates().then(function (value) { return _this.templateList = value; });
    };
    TemplatesComponent.prototype.openModal = function (template) {
        this.selectedTemplate = template;
        this.modal.show();
    };
    return TemplatesComponent;
}());
__decorate([
    core_1.ViewChild('modal'),
    __metadata("design:type", ng2_bootstrap_1.ModalDirective)
], TemplatesComponent.prototype, "modal", void 0);
TemplatesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./templates.html",
        providers: [image_service_1.ImageService],
        styleUrls: ["templates.css"]
    }),
    __metadata("design:paramtypes", [image_service_1.ImageService,
        router_1.Router])
], TemplatesComponent);
exports.TemplatesComponent = TemplatesComponent;
//# sourceMappingURL=templates.component.js.map