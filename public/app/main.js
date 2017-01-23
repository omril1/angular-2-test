"use strict";
var platform_browser_dynamic_1 = require("@angular/platform-browser-dynamic");
var app_module_1 = require("./app.module");
var WebFont = require('webfontloader');
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
WebFont.load({
    google: {
        families: ['Droid Sans', 'Droid Serif']
    }
});
//# sourceMappingURL=main.js.map