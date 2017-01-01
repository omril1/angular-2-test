import { Component } from '@angular/core';
//import * as routes from './routes/index';

@Component({
    selector: 'my-app',
    template: `
    <nav>
        <ul class="nav nav-justified">
            <li [routerLinkActive]="['active']"><a [routerLink]="['about']"       >about</a></li>
            <li [routerLinkActive]="['active']"><a [routerLink]="['list']"        >תמונות באתר</a></li>
            <li [routerLinkActive]="['active']"><a [routerLink]="['upload-image']">העלאת תמונות</a></li>
            <li [routerLinkActive]="['active']"><a [routerLink]="['templates']"   >תבניות</a></li>
        </ul>
    </nav>
    <br>
    <router-outlet></router-outlet>
`,
})

export class AppComponent {
    //routesStr = Object.keys(routes);
}