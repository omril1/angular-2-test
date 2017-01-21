"use strict";
var router_1 = require("@angular/router");
var index_1 = require("./routes/index");
var auth_guard_1 = require("./services/auth.guard");
var appRoutes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'about', component: index_1.AboutComponent },
    { path: 'upload-image', component: index_1.UploadImageComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'categories', component: index_1.CategoriesComponent },
    { path: 'templates', component: index_1.TemplatesComponent },
    { path: 'details/:id/:pageSize', component: index_1.DetailsComponent }
];
exports.AppRoutesModule = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map