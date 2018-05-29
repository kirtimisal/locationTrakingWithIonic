import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { IonicPage } from 'ionic-angular/navigation/ionic-page';

@IonicPage()
@Component({
  selector: 'page-erp-approval-item-deatils',
  templateUrl: 'erp-approval-item-deatils.html',
})
export class ErpApprovalItemDeatilsPage {
  itemDeatilsPage: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.itemDeatilsPage = navParams.get('itemDeatils');
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
