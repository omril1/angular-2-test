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
var ng2_file_upload_1 = require("ng2-file-upload");
var platform_browser_1 = require("@angular/platform-browser");
var image_service_1 = require("../services/image.service");
var auth_service_1 = require("../services/auth.service");
var utils_1 = require("../utils");
var UploadPanelComponent = (function () {
    function UploadPanelComponent(imageService, sanitizer, auth) {
        var _this = this;
        this.imageService = imageService;
        this.sanitizer = sanitizer;
        this.auth = auth;
        this.userUploads = [];
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/user/uploadImage",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: false,
            maxFileSize: 3 * 1024 * 1024,
            autoUpload: true,
            authToken: 'Bearer ' + this.auth.id_token
        });
        this.dropFromPanel = new core_1.EventEmitter();
        this.uploader.onAfterAddingFile = function (fileItem) {
            fileItem.previewUrl = _this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.uploader.onSuccessItem = function (item, response, status, headers) {
            _this.uploader.removeFromQueue(item);
            item._id = response;
            _this.userUploads.push(item);
        };
    }
    UploadPanelComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (this.auth.id_token)
            this.imageService.getUserUploadedImages().then(function (uploads) {
                _this.userUploads = uploads.map(function (upload) {
                    upload.previewUrl = '/user/userUploads/' + upload._id + "?id_token=" + _this.auth.id_token;
                    return upload;
                });
            });
    };
    UploadPanelComponent.prototype.dragStart = function (event) {
        event.srcElement.classList.add('dragged');
        utils_1.noGhostImage(event);
    };
    UploadPanelComponent.prototype.drag = function (event) {
        if (event.x > this.panel.nativeElement.getBoundingClientRect().width + 15)
            event.srcElement.classList.add('out-of-panel');
        else
            event.srcElement.classList.remove('out-of-panel');
    };
    UploadPanelComponent.prototype.dragEnd = function (event, item) {
        if (event.x > this.panel.nativeElement.getBoundingClientRect().width + 15)
            this.dropFromPanel.emit({ _id: item._id, x: event.x - event.offsetX, y: event.y - event.offsetY, width: event.srcElement.clientWidth, height: event.srcElement.clientHeight });
        else
            event.srcElement.classList.remove('dragged');
        event.srcElement.style.left = "0";
        event.srcElement.style.top = "0";
    };
    return UploadPanelComponent;
}());
__decorate([
    core_1.ViewChild('panel'),
    __metadata("design:type", core_1.ElementRef)
], UploadPanelComponent.prototype, "panel", void 0);
__decorate([
    core_1.Output(),
    __metadata("design:type", Object)
], UploadPanelComponent.prototype, "dropFromPanel", void 0);
UploadPanelComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        selector: 'upload-panel',
        templateUrl: './uploadPanel.html',
        styleUrls: ['uploadPanel.css']
    }),
    __metadata("design:paramtypes", [image_service_1.ImageService, platform_browser_1.DomSanitizer, auth_service_1.Auth])
], UploadPanelComponent);
exports.UploadPanelComponent = UploadPanelComponent;
//# sourceMappingURL=uploadPanel.js.map