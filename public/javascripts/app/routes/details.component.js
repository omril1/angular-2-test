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
var DetailsComponent = (function () {
    function DetailsComponent(route) {
        this.route = route;
        this.textFields = [];
        this.fieldsCounter = 0;
        this.selectedIndex = -1;
        this.removeField = function () {
            if (this.selectedIndex != -1) {
                this.textFields.splice(this.selectedIndex, 1);
                this.selectedIndex = -1;
            }
        };
        this.colorChanged = function (color) {
            this.color = color;
            if (this.selectedIndex != -1) {
                this.textFields[this.selectedIndex].color = color;
            }
        };
        this.addField = function () {
            var t = {
                left: 20,
                top: 30,
                width: 400,
                height: 40,
                text: "some text goes here",
                fontSize: "20.06pt",
                color: "#337ab7",
                index: this.fieldsCounter++
            };
            this.textFields.push(t);
        };
        this.mouseDown = function (fieldIndex, event) {
            if (event.button == 0) {
                this.selectedIndex = fieldIndex;
                if (fieldIndex != -1)
                    this.color = this.textFields[this.selectedIndex].color;
            }
        };
        //this.imageID = route.params['value']['id']; //old way
    }
    DetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.subscribe(function (params) { return _this.imageID = params['id']; });
    };
    DetailsComponent.prototype.ngOnDestroy = function () {
    };
    return DetailsComponent;
}());
DetailsComponent = __decorate([
    core_1.Component({
        moduleId: module.id,
        templateUrl: "/html-routes/details.html",
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute])
], DetailsComponent);
exports.DetailsComponent = DetailsComponent;
//# sourceMappingURL=details.component.js.map