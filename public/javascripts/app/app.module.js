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
var app_components_1 = require("./app.components");
var router_1 = require("@angular/router");
var about_component_1 = require("./routes/about.component");
var details_component_1 = require("./routes/details.component");
var list_component_1 = require("./routes/list.component");
var upload_image_component_1 = require("./routes/upload-image.component");
exports.appRoutes = [
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'about', component: about_component_1.AboutComponent },
    { path: 'list', component: list_component_1.ListComponent },
    { path: 'details/:id', component: details_component_1.DetailsComponent },
    { path: 'upload-image', component: upload_image_component_1.UploadImageComponent }
];
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            router_1.RouterModule.forRoot(exports.appRoutes),
            http_1.HttpModule
        ],
        declarations: [
            app_components_1.AppComponent,
            about_component_1.AboutComponent,
            list_component_1.ListComponent,
            details_component_1.DetailsComponent,
            upload_image_component_1.UploadImageComponent
        ],
        bootstrap: [app_components_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map