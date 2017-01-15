import { Component, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'login',
    moduleId: module.id,
    templateUrl: './login.html',
    styles: [`

    `]
})
export class LoginComponent {
    private username: string;
    private password: string;
    @Output() private loginResult = new EventEmitter();
    constructor() {

    }
    private sendCredentials() {
        console.log('sending credentials', this.username, this.password);
        this.loginResult.emit({});
    }
}