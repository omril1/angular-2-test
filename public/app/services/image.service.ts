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
    private baseUrl = '/imageapi';
    //private _pageSizes: { [id: string]: { width: number; height: number; }; } = { 'A4': { width: 793.7007874015748, height: 1122.51968503937 }, 'A5': { width: 561.259842519685, height: 793.7007874015748 } };
    //rounded some numbers
    private _pageSizes: { [id: string]: { width: number; height: number; }; } = { 'A4': { width: 793.7, height: 1122.52 }, 'A5': { width: 561.26, height: 793.700 } };
    public get pageSizes() {
        return this._pageSizes;
    }


    constructor(private http: Http) {
    }

    public getImageNames() {
        return this.http.get(`${this.baseUrl}/allimages`)
            .map(response => response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public getTemplates() {
        return this.http.get(`${this.baseUrl}/templates`)
            .map(response => <Template[]>response.json())
            .toPromise()
            .catch((error: any) => {
                throw (error || 'Server error')
            });
    }
    public getTemplate(templateId: string) {
        return this.http.get(`${this.baseUrl}/template/${templateId}`)
            .map(response => <Template>response.json())
            .toPromise().catch(reason => { console.error(reason); return <Template>null; });
    }

    public sendToProcessing(template: Template) {
        let body = JSON.stringify(template);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'/*, 'withCredentials': false */ });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${this.baseUrl}/proccessimage`, body, options).toPromise()
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }

    public saveInServer(template: Template) {
        let body = JSON.stringify(template);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'/*, 'withCredentials': false */ });
        let options = new RequestOptions({ headers: headers });
        return this.http.post(`${this.baseUrl}/save`, body, options).toPromise()
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }
}