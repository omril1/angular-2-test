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
var ng2_file_upload_1 = require("ng2-file-upload");
var messages_service_1 = require("../../services/messages.service");
var ManagmentComponent = (function () {
    function ManagmentComponent(messages, sanitizer) {
        this.messages = messages;
        this.sanitizer = sanitizer;
    }
    ManagmentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/adminapi/something",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024,
            //authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: false,
        });
        this.uploader.onAfterAddingAll = function (files) {
            files.forEach(function (fileItem) {
                fileItem.file.name = fileItem.file.name.replace(/\.[^/.]+$/, "");
                fileItem.previewUrl = _this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
            });
        };
    };
    return ManagmentComponent;
}());
ManagmentComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: './managment.html',
        styleUrls: ['managment.css'],
    }),
    __metadata("design:paramtypes", [messages_service_1.Messages, platform_browser_1.DomSanitizer])
], ManagmentComponent);
exports.ManagmentComponent = ManagmentComponent;
//# sourceMappingURL=index.js.map