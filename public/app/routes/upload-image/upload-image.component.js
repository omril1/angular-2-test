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
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var ng2_file_upload_1 = require("ng2-file-upload");
var UploadImageComponent = (function () {
    function UploadImageComponent(sanitizer) {
        var _this = this;
        this.sanitizer = sanitizer;
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/imageapi/upload",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: false,
            maxFileSize: 3 * 1024 * 1024 //3 MB
        });
        //dirty way to add a thumbnail support.
        this.uploader.onAfterAddingFile = function (fileItem) {
            fileItem.previewUrl = _this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
    }
    return UploadImageComponent;
}());
UploadImageComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./upload-image.html",
        styles: ["\n    .my-drop-zone {\n        border: dotted 3px lightgray;\n    }\n\n    .nv-file-over {\n        border: dotted 3px red;\n    }"]
    }),
    __metadata("design:paramtypes", [platform_browser_1.DomSanitizer])
], UploadImageComponent);
exports.UploadImageComponent = UploadImageComponent;
//# sourceMappingURL=upload-image.component.js.map