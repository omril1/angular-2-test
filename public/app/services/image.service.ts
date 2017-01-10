import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export interface Template {
    name?: string;
    _id: string;
    imageId: string;
    textFields: ItextField[];
}
export interface ItextField {
    top: number;
    left: number;
    width: number;
    height: number;
    text: string;
    font: string;
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
    align: string;
    underline: boolean;
    rotation: number;
    stroke: {
        color: string;
        width: number;
    };
    shadow: {
        color: string;
        x: number;
        y: number;
        blur: number;
    };
    letterSpace: number,
    wordSpace: number,
}

@Injectable()
export class ImageService {
    private baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl = '/imageapi';
    }

    getImageNames() {
        return this.http.get(`${this.baseUrl}/allimages`)
            .map(response => response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    getTemplates() {
        return this.http.get(`${this.baseUrl}/templates`)
            .map(response => <Template[]>response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    getTemplate(templateId: string) {
        return this.http.get(`${this.baseUrl}/template/${templateId}`)
            .map(response => <Template>response.json())
            .toPromise().catch(reason => { console.error(reason); return <Template>null; });
    }

    sendToProcessing(template: Template) {
        let body = JSON.stringify(template);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'/*, 'withCredentials': false */ });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${this.baseUrl}/proccessimage`, body, options).toPromise()
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }

    saveInServer(template: Template) {
        let body = JSON.stringify(template);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'/*, 'withCredentials': false */ });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${this.baseUrl}/save`, body, options).toPromise()
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }
}