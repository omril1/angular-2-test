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
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var angular2_jwt_1 = require("angular2-jwt");
var ng2_file_upload_1 = require("ng2-file-upload");
var ng2_draggable_1 = require("ng2-draggable");
var ng2_bootstrap_1 = require("ng2-bootstrap");
var angular2_color_picker_1 = require("angular2-color-picker");
var primeng_1 = require("primeng/primeng");
var app_components_1 = require("./app.components");
var app_routing_1 = require("./app.routing");
var index_1 = require("./routes/index");
var login_1 = require("./components/login");
var zoomToolbar_1 = require("./components/zoomToolbar");
var safeStyle_1 = require("./pipes/safeStyle");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            ng2_draggable_1.DraggableModule,
            angular2_color_picker_1.ColorPickerModule,
            ng2_bootstrap_1.DropdownModule.forRoot(),
            ng2_bootstrap_1.ModalModule.forRoot(),
            ng2_bootstrap_1.CollapseModule.forRoot(),
            ng2_bootstrap_1.PopoverModule.forRoot(),
            ng2_bootstrap_1.ProgressbarModule.forRoot(),
            primeng_1.ContextMenuModule,
            primeng_1.GrowlModule,
            primeng_1.SliderModule,
            primeng_1.GMapModule,
            primeng_1.OverlayPanelModule,
            app_routing_1.AppRoutesModule,
        ],
        providers: [angular2_jwt_1.AUTH_PROVIDERS],
        declarations: [
            app_components_1.AppComponent,
            index_1.AboutComponent,
            index_1.TemplatesComponent,
            index_1.ListComponent,
            index_1.DetailsComponent,
            index_1.UploadImageComponent,
            zoomToolbar_1.ZoomToolbarComponent,
            login_1.LoginComponent,
            ng2_file_upload_1.FileSelectDirective,
            ng2_file_upload_1.FileDropDirective,
            safeStyle_1.safeStyle,
        ],
        bootstrap: [app_components_1.AppComponent]
    }),
    __metadata("design:paramtypes", [])
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map