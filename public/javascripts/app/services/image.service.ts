import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

export interface Image {
    name?: String;
    ID: String;
    textFields: ItextField[];
}
export interface ItextField {
    top: number;
    left: number;
    width: number;
    height: number;
    text: string;
    font: string;
    index: number;
    fontSize: number;
    color: string;
    bold: boolean;
    italic: boolean;
    align: string;
    underline: boolean;
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

    sendToProcessing(image: Image) {
        let body = JSON.stringify(image);
        let headers = new Headers({ 'Content-Type': 'application/json', 'charset': 'UTF-8'/*, 'withCredentials': false */ }); // ... Set content type to JSON
        let options = new RequestOptions({ headers: headers, body: image }); // Create a request option
        return this.http.post(`${this.baseUrl}/proccessimage`, body, options).toPromise()
            //.map(response => response.json())
            .catch((error: any) =>
                Promise.reject(error || 'Server error'));
    }
}