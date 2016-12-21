import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';

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
    { path: 'list', component: ListComponent },
    { path: 'details/:id', component: DetailsComponent },
    { path: 'upload-image', component: UploadImageComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        RouterModule.forRoot(appRoutes),
        HttpModule
    ],
    declarations: [
        AppComponent,
        AboutComponent,
        ListComponent,
        DetailsComponent,
        UploadImageComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }