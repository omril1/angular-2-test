import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { ModalModule } from 'ng2-bootstrap';

import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { DraggableModule } from 'ng2-draggable';
import { DropdownModule } from 'ng2-bootstrap';
import { ColorPickerModule } from 'angular2-color-picker';
import { ContextMenuModule } from 'primeng/primeng';

import { AppComponent } from './app.components';
import { AboutComponent, DetailsComponent, ListComponent, UploadImageComponent, ManagmentComponent } from './routes/index';


import { ImageService } from './services/image.service'

const appRoutes: Routes = [
    { path: '', redirectTo: 'list', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'upload-image', component: UploadImageComponent },
    { path: 'list', component: ListComponent },
    { path: 'managment', component: ManagmentComponent },
    { path: 'details/:id/:height/:width', component: DetailsComponent }
];
export const AppRoutesModule = RouterModule.forRoot(appRoutes);

@NgModule({
    imports: [
        BrowserModule,
        AppRoutesModule,
        HttpModule,
        FormsModule,
        DraggableModule,
        DropdownModule.forRoot(),
        ColorPickerModule,
        ModalModule.forRoot(),
        ContextMenuModule
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        ListComponent,
        DetailsComponent,
        UploadImageComponent,
        FileSelectDirective,
        FileDropDirective
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }