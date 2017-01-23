import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app.module';
var WebFont = require('webfontloader');

platformBrowserDynamic().bootstrapModule(AppModule);
WebFont.load({
    google: {
        families: ['Droid Sans', 'Droid Serif']
    }
});