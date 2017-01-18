import { Component, Input, Output, EventEmitter  } from '@angular/core';

@Component({
    moduleId: module.id,
    selector: 'zoom-toolbar',
    templateUrl: 'zoomToolbar.html',
    styles: [`
        :host { position:fixed;bottom:0;right:0;margin:0px 15px 40px 0;-ms-zoom:reset;zoom:reset;opacity:0.4;transition:opacity 0.5s ease;z-index:1000; }
        :host:hover { opacity:1 }
        .zoom-buttons { display: block;float:right;margin-bottom:5px; }
        .zoom-buttons button { width:40px;height:40px;border-radius:50%;margin:2px;outline:none }
        .zoom-buttons button svg{pointer-events: none; display: block; width: 100%; height: 100%;}
    `]
})
export class ZoomToolbarComponent {
    private zoomLevels = [.2, .3, .4, .5, .6, .7, .8, .9, 1, 1.2, 1.5, 1.75, 2, 4];
    private zoomIndex = 8;
    @Output() zoomChanged = new EventEmitter<number>(false);
    constructor() {
    }
    public zoomIn() {
        if (this.zoomIndex < this.zoomLevels.length - 1) {
            this.zoomIndex++;
            this.zoomChanged.emit(this.zoomLevels[this.zoomIndex]);
        }
    }
    public zoomOut() {
        if (this.zoomIndex > 0) {
            this.zoomIndex--;
            this.zoomChanged.emit(this.zoomLevels[this.zoomIndex]);
        }
    }
}