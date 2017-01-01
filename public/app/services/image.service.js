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
var http_1 = require("@angular/http");
require("rxjs/add/operator/map");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/toPromise");
var ImageService = (function () {
    function ImageService(http) {
        this.http = http;
        this.baseUrl = '/imageapi';
    }
    ImageService.prototype.getImageNames = function () {
        return this.http.get(this.baseUrl + "/allimages")
            .map(function (response) { return response.json(); })
            .toPromise()
            .catch(function (error) {
            throw (error || 'Server error');
        });
    };
    ImageService.prototype.getTemplates = function () {
        return this.http.get(this.baseUrl + "/templates")
            .map(function (response) { return response.json(); })
            .toPromise()
            .catch(function (error) {
            throw (error || 'Server error');
        });
    };
    ImageService.prototype.getTemplate = function (templateId) {
        return this.http.get(this.baseUrl + "/template/" + templateId)
            .map(function (response) { return response.json(); })
            .toPromise()
            .catch(function (error) {
            throw (error || 'Server error');
        });
    };
    ImageService.prototype.sendToProcessing = function (template) {
        var body = JSON.stringify(template);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' /*, 'withCredentials': false */ });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + "/proccessimage", body, options).toPromise()
            .catch(function (error) {
            return Promise.reject(error || 'Server error');
        });
    };
    ImageService.prototype.saveInServer = function (template) {
        var body = JSON.stringify(template);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' /*, 'withCredentials': false */ });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.post(this.baseUrl + "/save", body, options).toPromise()
            .catch(function (error) {
            return Promise.reject(error || 'Server error');
        });
    };
    return ImageService;
}());
ImageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], ImageService);
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map