import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-text-area-popover',
  templateUrl: 'text-area-popover.html',
})
export class TextAreaPopoverPage {
  heading: any;
  comment = { val: '' };
  previous_val;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.previous_val = this.navParams.get('data1');
    this.heading = this.navParams.get('heading');
    this.comment.val = this.previous_val;
  }
  save() {
    let text_data = this.comment.val;
    this.viewCtrl.dismiss(text_data);
  }

  cancelModal() {
    this.viewCtrl.dismiss();
  }
}
