/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'app': 'app', // 'dist',
        '@angular': 'npm:@angular',
        //'angular2-in-memory-web-api': 'npm:angular2-in-memory-web-api',
        'rxjs': 'npm:rxjs',
        'moment': 'npm:moment/moment.js',
        'dom-to-image': 'npm:dom-to-image/src/dom-to-image.js',
        'ng2-file-upload': 'npm:ng2-file-upload/bundles/ng2-file-upload.umd.js',
        'ng2-draggable': 'npm:ng2-draggable/index.js',
        'ng2-bootstrap': 'npm:ng2-bootstrap/bundles/ng2-bootstrap.umd.js',
        'angular2-color-picker': 'npm:angular2-color-picker',
        'primeng': 'npm:primeng',
        'angular2-jwt': 'npm:angular2-jwt/angular2-jwt.js',
        //'auth0-lock': 'npm:auth0-lock/lib',
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        'angular2-jwt': { defaultExtension: 'js' },
        //'auth0-lock': { main:'index.js', defaultExtention: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' },
        'angular2-color-picker': { main: 'index.js', defaultExtension: 'js' },
        'primeng': { main: 'index.js', defaultExtension: 'js' },
        //'ng2-bootstrap': { main: 'index.js', defaultExtension: 'js' },
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
        'forms',
        'router',
        'router-deprecated',
        'upgrade',
    ];
    // Add package entries for angular packages
    ngPackageNames.forEach(function (pkgName) {
        packages['@angular/' + pkgName] = { main: "bundles/" + pkgName + '.umd.js', defaultExtension: 'js' };
    });
    var config = {
        paths: {
            // paths serve as alias
            'npm:': 'node_modules/'
        },
        map: map,
        packages: packages
    }
    System.config(config);
})(this);