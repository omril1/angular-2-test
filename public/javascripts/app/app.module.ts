import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FileSelectDirective, FileDropDirective, FileUploader } from 'ng2-file-upload';
import { DraggableModule } from 'ng2-draggable';

import { AppComponent } from './app.components';
import { RouterModule, Routes } from '@angular/router';

import { AboutComponent } from './routes/about.component';
import { DetailsComponent } from './routes/details.component';
import { ListComponent } from './routes/list.component';
import { UploadImageComponent } from './routes/upload-image.component';


import { ImageService } from './services/image.service'

export const appRoutes: Routes = [
    { path: '', redirectTo: 'about', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'upload-image', component: UploadImageComponent },
    { path: 'list', component: ListComponent },
    { path: 'details/:id', component: DetailsComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        HttpModule,
        DraggableModule
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