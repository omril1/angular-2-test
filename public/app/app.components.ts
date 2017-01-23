import { Component } from '@angular/core';
import { Auth } from './services/auth.service';
import { Messages } from './services/messages.service';

@Component({
    moduleId: module.id,
    selector: 'my-app',
    templateUrl: "./app.view.html",
    providers: [Auth]
})

export class AppComponent {
    private msgs;
    constructor(private auth: Auth, private messages: Messages) {
        this.msgs = this.messages.msgs;
    }
}