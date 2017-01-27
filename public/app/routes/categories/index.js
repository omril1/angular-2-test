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
var image_service_1 = require("../../services/image.service");
var auth_service_1 = require("../../services/auth.service");
var ng2_file_upload_1 = require("ng2-file-upload");
var CategoriesComponent = (function () {
    function CategoriesComponent(imageService, auth, sanitizer) {
        this.imageService = imageService;
        this.auth = auth;
        this.sanitizer = sanitizer;
        this.filter = "";
        this.uploader = new ng2_file_upload_1.FileUploader({
            url: "/adminapi/uploadCategory",
            allowedMimeType: ['image/png', 'image/bmp', 'image/jpeg'],
            removeAfterUpload: true,
            maxFileSize: 3 * 1024 * 1024,
            authToken: 'Bearer ' + this.auth.id_token,
            autoUpload: true,
        });
    }
    CategoriesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.imageService.getCategories().then(function (value) {
            _this.categoryList = value;
            _this.container.nativeElement.classList.remove('blurred');
        });
        this.uploader.onAfterAddingFile = function (fileItem) {
            fileItem.previewUrl = _this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(fileItem._file)));
        };
        this.uploader.onCompleteItem = function (item, response, status) {
            if (status == 200) {
                var newCategory = { metadata: { categoryName: item.file.name.replace(/\.[^/.]+$/, "") }, filename: response };
                _this.categoryList.unshift(newCategory);
            }
        };
    };
    CategoriesComponent.prototype.removeCategory = function (category, index) {
        var _this = this;
        this.imageService.removeCategory(category.filename).then(function () {
            category.deleted = (category.deleted === 'active' ? 'inactive' : 'active');
            _this.categoryList.splice(index, 1);
        });
    };
    return CategoriesComponent;
}());
__decorate([
    core_1.ViewChild('container'),
    __metadata("design:type", core_1.ElementRef)
], CategoriesComponent.prototype, "container", void 0);
CategoriesComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "./categories.html",
        providers: [image_service_1.ImageService],
        styleUrls: ["categories.css"],
        animations: [
            core_1.trigger('categoryState', [
                core_1.state('inactive', core_1.style({ opacity: 1, })),
                core_1.state('active', core_1.style({ opacity: 1, })),
                core_1.state('void', core_1.style({ opacity: 0, display: 'none', })),
                core_1.transition('* => void', [
                    core_1.animate('0.3s 8 ease', core_1.style({
                        opacity: '0',
                        transform: 'rotateY(90deg)'
                    }))
                ]),
                core_1.transition('void => *', [
                    core_1.animate('0.6s 8 ease', core_1.style({
                        opacity: '1'
                    }))
                ])
            ])
        ],
    }),
    __metadata("design:paramtypes", [image_service_1.ImageService, auth_service_1.Auth, platform_browser_1.DomSanitizer])
], CategoriesComponent);
exports.CategoriesComponent = CategoriesComponent;
//# sourceMappingURL=index.js.map