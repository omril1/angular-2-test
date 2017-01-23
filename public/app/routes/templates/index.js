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
var auth_service_1 = require("../../services/auth.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var messages_service_1 = require("../../services/messages.service");
var TemplatesComponent = (function () {
    function TemplatesComponent(imageService, router, route, auth, messages) {
        var _this = this;
        this.imageService = imageService;
        this.router = router;
        this.route = route;
        this.auth = auth;
        this.messages = messages;
        this.pageSizes = Object.keys(imageService.pageSizes);
        this.route.params.subscribe(function (params) {
            _this.categoryId = params['categoryId'];
        });
    }
    TemplatesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageService.getTemplates(this.categoryId).then(function (value) {
            _this.templateList = value;
        });
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/adminapi/uploadTemplate/" + this.categoryId,
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024,
            authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: true,
        });
        this.uploader.onAfterAddingFile = function (fileItem) {
            //(<any>fileItem).previewUrl = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.uploader.onCompleteItem = function (item, response, status) {
            if (status == 200) {
                _this.templateList.unshift(JSON.parse(response));
            }
        };
    };
    TemplatesComponent.prototype.openModal = function (template) {
        if (this.auth.authenticated()) {
            this.selectedTemplate = template;
            this.modal.show();
        }
        else
            this.messages.warn("עליך להתחבר כדי להמשיך");
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
    __metadata("design:paramtypes", [image_service_1.ImageService, router_1.Router, router_1.ActivatedRoute, auth_service_1.Auth, messages_service_1.Messages])
], TemplatesComponent);
exports.TemplatesComponent = TemplatesComponent;
//# sourceMappingURL=index.js.map