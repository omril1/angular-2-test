"use strict";
var router_1 = require("@angular/router");
var index_1 = require("./routes/index");
var appRoutes = [
    { path: '', redirectTo: 'templates', pathMatch: 'full' },
    { path: 'about', component: index_1.AboutComponent },
    { path: 'upload-image', component: index_1.UploadImageComponent },
    { path: 'list', component: index_1.ListComponent },
    { path: 'templates', component: index_1.TemplatesComponent },
    { path: 'details/:id/:pageSize', component: index_1.DetailsComponent }
];
exports.AppRoutesModule = router_1.RouterModule.forRoot(appRoutes);
//# sourceMappingURL=app.routing.js.map