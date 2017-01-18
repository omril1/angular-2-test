import { RouterModule, Routes } from '@angular/router';
import { AboutComponent, DetailsComponent, ListComponent, UploadImageComponent, TemplatesComponent } from './routes/index';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    { path: 'upload-image', component: UploadImageComponent, canActivate: [AuthGuard] },
    { path: 'list', component: ListComponent },
    { path: 'templates', component: TemplatesComponent },
    { path: 'details/:id/:pageSize', component: DetailsComponent }
];
export const AppRoutesModule = RouterModule.forRoot(appRoutes);