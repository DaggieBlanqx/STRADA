import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'app-ui',
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UiComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
        //
    }

}
