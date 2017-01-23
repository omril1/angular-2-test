import { RouterModule, Routes } from '@angular/router';
import { AboutComponent, DetailsComponent, CategoriesComponent, UploadImageComponent, TemplatesComponent } from './routes/index';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    //{ path: 'upload-image', component: UploadImageComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent },
    { path: 'categories/:categoryId', component: TemplatesComponent },
    { path: 'details/:id/:pageSize', component: DetailsComponent, canActivate: [AuthGuard] }
];
export const AppRoutesModule = RouterModule.forRoot(appRoutes);