import { Component, OnInit } from '@angular/core'

@Component({
    moduleId: module.id,
    templateUrl: "./about.html"
})
export class AboutComponent implements OnInit {
    options: any;

    overlays: any[];

    ngOnInit() {
        this.options = {
            center: { lat: 32.0811371, lng: 34.8891323 },
            zoom: 17
        };

        this.overlays = [
            new google.maps.Circle({ center: { lat: 32.0811371, lng: 34.8891323 }, fillColor: '#1976D2', fillOpacity: 0.35, strokeWeight: 1, radius: 1 }),
            new google.maps.Marker({ position: { lat: 32.0811371, lng: 34.8891323 }, title: "הבית של סוניה" }),
        ];
    }
}