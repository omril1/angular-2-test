import { Pipe, Sanitizer } from '@angular/core';

@Pipe({ name: 'safeStyle' })
export class safeStyle {
    constructor(private sanitizer: Sanitizer) { }

    transform(style: string) {
        return this.sanitizer.bypassSecurityTrustStyle(style);
    }
}