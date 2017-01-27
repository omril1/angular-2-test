import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { FileSelectDirective, FileDropDirective } from 'ng2-file-upload';
import { DraggableModule } from 'ng2-draggable';
import { DropdownModule, ModalModule, CollapseModule, PopoverModule, ProgressbarModule } from 'ng2-bootstrap';
import { ColorPickerModule } from 'angular2-color-picker';
import { ContextMenuModule, GrowlModule, SliderModule, GMapModule, OverlayPanelModule, AccordionModule } from 'primeng/primeng';

import { AppComponent } from './app.components';
import { AppRoutesModule } from './app.routing';
import { AboutComponent, DetailsComponent, CategoriesComponent, UploadImageComponent, TemplatesComponent, ManagmentComponent } from './routes/index';
import { LoginComponent } from './components/login';
import { UploadPanelComponent } from './components/uploadPanel';
import { ZoomToolbarComponent } from './components/zoomToolbar';
import { AuthGuard } from './services/auth.guard';
import { Auth } from './services/auth.service';
import { Messages } from './services/messages.service';
import { filterCategory } from "./pipes/filterCategory";

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
        PopoverModule.forRoot(),
        ProgressbarModule.forRoot(),
        ContextMenuModule,
        GrowlModule,
        SliderModule,
        GMapModule,
        OverlayPanelModule,
        AccordionModule,
        AppRoutesModule,
    ],
    providers: [AuthGuard, Auth, AUTH_PROVIDERS, Messages],
    declarations: [
        AppComponent,
        AboutComponent,
        CategoriesComponent,
        DetailsComponent,
        TemplatesComponent,
        ManagmentComponent,
        UploadImageComponent,
        ZoomToolbarComponent,
        UploadPanelComponent,
        LoginComponent,
        FileSelectDirective,
        FileDropDirective,
        filterCategory,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }