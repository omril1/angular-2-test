import { Injectable } from '@angular/core';
import { Http, RequestOptionsArgs } from '@angular/http';
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
            .catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }

    sendToProcessing(Image: Image) {
        return this.http.post(`${this.baseUrl}/proccessimage`, JSON.stringify(Image), { withCredentials: false }).toPromise();
            //.map(response => response.json())
            //.catch((error: any) => Observable.throw(error.json().error || 'Server error'));
    }
}