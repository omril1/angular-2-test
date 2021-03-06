﻿import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Auth } from './auth.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export interface Template {
    name?: string;
    _id: string;
    imageId: string;
    categoryId: string;
    thumbnailId: string;
    width: number;
    height: number;
    moveableFields: moveableField[];
}
export interface moveableField {
    top: number;
    left: number;
    width: number;
    height: number;
    rotation: number;
    isImage: boolean;

    text?: string;
    font?: string;
    fontSize?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
    align?: string;
    underline?: boolean;
    stroke?: {
        color: string;
        width: number;
    };
    shadow?: {
        color: string;
        x: number;
        y: number;
        blur: number;
    };
    letterSpace?: number;
    wordSpace?: number;

    imageId?: string;
}

@Injectable()
export class ImageService {
    private authorizedOptions = { headers: new Headers({ 'Authorization': 'Bearer ' + this.auth.id_token }) }
    private _pageSizes: { [id: string]: { width: number; height: number; }; } = { 'A4': { width: 793.7, height: 1122.52 }, 'A5': { width: 561.26, height: 793.700 } };
    public get pageSizes() {
        return this._pageSizes;
    }

    constructor(private http: Http, private auth: Auth) { }

    public getUserUploadedImages() {
        return this.http.get('/user/userUploads', this.authorizedOptions)
            .map(response => response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public getCategories() {
        return this.http.get(`/imageapi/categories`)
            .map(response => <any[]>response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public removeCategory(_id: string) {
        return this.http.delete(`/adminapi/removecategory/` + _id, this.authorizedOptions)
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public getTemplates(categoryId: string) {
        return this.http.get(`/imageapi/templates/` + categoryId)
            .map(response => <Template[]>response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public getTemplate(templateId: string) {
        return this.http.get(`/imageapi/template/${templateId}`)
            .map(response => <Template>response.json())
            .toPromise().catch(reason => { console.error(reason); return <Template>null; });
    }
    public removeTemplate(_id: string) {
        return this.http.delete(`/adminapi/removeTemplate/` + _id, this.authorizedOptions)
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public saveInServer(template: Template) {
        let body = JSON.stringify(template);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8' });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`/imageapi/save`, body, options).toPromise()
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }
}