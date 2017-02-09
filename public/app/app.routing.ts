import { RouterModule, Routes } from '@angular/router';
import { AboutComponent, DetailsComponent, CategoriesComponent, UploadImageComponent, TemplatesComponent, ManagmentComponent } from './routes/index';
import { AuthGuard } from './services/auth.guard';

const appRoutes: Routes = [
    { path: '', redirectTo: 'categories', pathMatch: 'full' },
    { path: 'about', component: AboutComponent },
    //{ path: 'upload-image', component: UploadImageComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: CategoriesComponent },
    { path: 'categories/:categoryId', component: TemplatesComponent },
    { path: 'details/:id', component: DetailsComponent, canActivate: [AuthGuard] },
    { path: 'managment', component: ManagmentComponent },
];
export const AppRoutesModule = RouterModule.forRoot(appRoutes);