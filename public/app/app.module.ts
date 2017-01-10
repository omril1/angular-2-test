import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { DraggableModule } from 'ng2-draggable';
import { DropdownModule, ModalModule, CollapseModule } from 'ng2-bootstrap';
import { ColorPickerModule } from 'angular2-color-picker';
import { ContextMenuModule, GrowlModule, SliderModule, GMapModule } from 'primeng/primeng';

import { AppComponent } from './app.components';
import { AppRoutesModule } from './app.routing';
import { AboutComponent, DetailsComponent, ListComponent, UploadImageComponent, TemplatesComponent } from './routes/index';
import { safeStyle } from "./pipes/safeStyle";

import { ImageService } from './services/image.service'


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        DraggableModule,
        ColorPickerModule,
        DropdownModule.forRoot(),
        ModalModule.forRoot(),
        CollapseModule.forRoot(),
        ContextMenuModule,
        GrowlModule,
        SliderModule,
        GMapModule,
        AppRoutesModule,
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        TemplatesComponent,
        ListComponent,
        DetailsComponent,
        UploadImageComponent,
        FileSelectDirective,
        FileDropDirective,
        safeStyle,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }