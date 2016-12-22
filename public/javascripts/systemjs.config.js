/**
 * System configuration for Angular 2 samples
 * Adjust as necessary for your application needs.
 */
(function (global) {
    // map tells the System loader where to look for things
    var map = {
        'app': 'javascripts/app', // 'dist',
        '@angular': 'npm:/@angular',
        //'angular2-in-memory-web-api': 'npm:/angular2-in-memory-web-api',
        'rxjs': 'npm:/rxjs',
        'ng2-file-upload': 'npm:ng2-file-upload/bundles/ng2-file-upload.umd.js',
        'ng2-draggable': 'npm:ng2-draggable/index.js',
    };
    // packages tells the System loader how to load when no filename and/or no extension
    var packages = {
        'app': { main: 'main.js', defaultExtension: 'js' },
        'rxjs': { defaultExtension: 'js' },
        'angular2-in-memory-web-api': { defaultExtension: 'js' },
    };
    var ngPackageNames = [
        'common',
        'compiler',
        'core',
        'http',
        'platform-browser',
        'platform-browser-dynamic',
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