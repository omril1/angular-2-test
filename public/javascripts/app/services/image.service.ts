import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

export interface Image {
    name: String;
    ID: String;
    textFields: ItextField[];
}
export interface ItextField {
    top?: number;
    left?: number;
    text?: String;
    index?: number;
    fontSize?: String;
    color?: String;
}

@Injectable()
export class ImageService {
    private baseUrl: string;

    constructor(private http: Http) {
        this.baseUrl = '/imageapi';
    }

    getImageNames() {
        return this.http.get(`${this.baseUrl}/allimages`).map(response => response.json()).subscribe(data => {
            return data;
        }, error => console.log('Could not get all'));
    }
}