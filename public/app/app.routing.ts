import { RouterModule, Routes } from '@angular/router';
import { AboutComponent, DetailsComponent, ListComponent, UploadImageComponent, TemplatesComponent } from './routes/index';

const appRoutes: Routes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'upload-image', component: UploadImageComponent },
    { path: 'list', component: ListComponent },
    { path: 'templates', component: TemplatesComponent },
    { path: 'details/:id/:height/:width', component: DetailsComponent }
];
export const AppRoutesModule = RouterModule.forRoot(appRoutes);