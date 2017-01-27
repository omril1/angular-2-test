"use strict";
var router_1 = require("@angular/router");
var index_1 = require("./routes/index");
var auth_guard_1 = require("./services/auth.guard");
var appRoutes = [
    { path: '', redirectTo: 'categories', pathMatch: 'full' },
    { path: 'about', component: index_1.AboutComponent },
    //{ path: 'upload-image', component: UploadImageComponent, canActivate: [AuthGuard] },
    { path: 'categories', component: index_1.CategoriesComponent },
    { path: 'categories/:categoryId', component: index_1.TemplatesComponent },
    { path: 'details/:id', component: index_1.DetailsComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'managment', component: index_1.ManagmentComponent, canActivate: [auth_guard_1.AuthGuard] },
];
exports.AppRoutesModule = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map