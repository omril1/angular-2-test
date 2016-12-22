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
var http_1 = require("@angular/http");
var router_1 = require("@angular/router");
var ng2_file_upload_1 = require("ng2-file-upload");
var ng2_draggable_1 = require("ng2-draggable");
var angular2_color_picker_1 = require("angular2-color-picker");
var app_components_1 = require("./app.components");
var index_1 = require("./routes/index");
var appRoutes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'about', component: index_1.AboutComponent },
    { path: 'upload-image', component: index_1.UploadImageComponent },
    { path: 'list', component: index_1.ListComponent },
    { path: 'details/:id', component: index_1.DetailsComponent }
];
exports.AppRoutesModule = router_1.RouterModule.forRoot(appRoutes);
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            exports.AppRoutesModule,
            http_1.HttpModule,
            ng2_draggable_1.DraggableModule,
            angular2_color_picker_1.ColorPickerModule
        ],
        declarations: [
            app_components_1.AppComponent,
            index_1.AboutComponent,
            index_1.ListComponent,
            index_1.DetailsComponent,
            index_1.UploadImageComponent,
            ng2_file_upload_1.FileSelectDirective,
            ng2_file_upload_1.FileDropDirective
        ],
        bootstrap: [app_components_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map