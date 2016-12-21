import { Component } from '@angular/core';

@Component({
    selector: 'my-app',
    template: `
    <nav>
        <ul class="nav nav-justified">
            <!--<li><a href="/about">about</a></li>
            <li><a href="/list">list</a></li>
            <li><a href="/upload-image">upload image</a></li>-->
            <li><a [routerLink]="['/about']">about</a></li>
            <li><a [routerLink]="['/list']">list</a></li>
            <li><a [routerLink]="['/upload-image']">upload image</a></li>
        </ul>
    </nav>
    <router-outlet></router-outlet>
`,
})

export class AppComponent {

}