import { Component } from '@angular/core';
import { Auth } from './services/auth.service';
import { AUTH_PROVIDERS } from 'angular2-jwt';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: "./app.view.html",
    providers: [Auth]
})

export class AppComponent {
    constructor(private auth: Auth) {
    }
}