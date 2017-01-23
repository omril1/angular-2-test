import { Pipe } from '@angular/core';

@Pipe({
    name: 'filterCategory',
    pure: false
})
export class filterCategory {
    constructor() { }

    transform(array: Array<any>, filter?) {
        return array.filter((elem) => { return elem.metadata && elem.metadata.categoryName.indexOf(filter) > -1 });
    }
}