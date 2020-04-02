import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { ViewController } from 'ionic-angular';

@Component({
    selector: 'modal-page',
    templateUrl: 'modal.html'
})
export class ModalPage {
    data: any[] = [];
    type: string;
    countrySearched: boolean = false;
    showMoreInfo: boolean = false;
    constructor(public viewController: ViewController, public params: NavParams) {
        console.log('params', params.data.data, params.data.type);
        this.data = params.data.data;
        this.type = params.data.type;
        this.countrySearched = params.data.countrySearched;
        this.showMoreInfo = params.data.moreInfo;
    }

    dismiss() {
        this.viewController.dismiss();
    }

}