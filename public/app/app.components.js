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
//import * as routes from './routes/index';
var AppComponent = (function () {
    function AppComponent() {
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: "\n    <nav>\n        <ul class=\"nav nav-justified\">\n            <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['about']\"       >about</a></li>\n            <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['list']\"        >\u05EA\u05DE\u05D5\u05E0\u05D5\u05EA \u05D1\u05D0\u05EA\u05E8</a></li>\n            <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['upload-image']\">\u05D4\u05E2\u05DC\u05D0\u05EA \u05EA\u05DE\u05D5\u05E0\u05D5\u05EA</a></li>\n            <li [routerLinkActive]=\"['active']\"><a [routerLink]=\"['templates']\"   >\u05EA\u05D1\u05E0\u05D9\u05D5\u05EA</a></li>\n        </ul>\n    </nav>\n    <br>\n    <router-outlet></router-outlet>\n",
    }),
    __metadata("design:paramtypes", [])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.components.js.map