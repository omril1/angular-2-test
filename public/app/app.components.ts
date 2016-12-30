import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
    <nav>
        <ul class="nav nav-justified">
            <li><a [routerLink]="['/about']">about</a></li>
            <li><a [routerLink]="['/list']">list</a></li>
            <li><a [routerLink]="['/upload-image']">upload image</a></li>
            <li><a [routerLink]="['/managment']">managment</a></li>
        </ul>
    </nav>
    <br>
    <router-outlet></router-outlet>
`,
})

export class AppComponent {

}