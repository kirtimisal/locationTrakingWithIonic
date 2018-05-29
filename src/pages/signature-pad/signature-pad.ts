import { Component, ViewChild } from '@angular/core';
import {  NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { SignaturePad } from 'angular2-signaturepad/signature-pad'

@IonicPage()
@Component({
  selector: 'page-signature-pad',
  templateUrl: 'signature-pad.html',
})
export class SignaturePadPage {
  @ViewChild(SignaturePad) public signaturePad: SignaturePad;
  private signatureImage: string;
  public signaturePadOptions: Object = {
    'minWidth': 2,
    'canvasWidth': 400,
    'canvasHeight': 200
  };
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
  }

  drawComplete() {
    this.signatureImage = this.signaturePad.toDataURL();
    this.viewCtrl.dismiss(this.signatureImage);
  }
  drawClear() {
    this.signaturePad.clear();
  }

  dismissModal() {
    this.navCtrl.pop();
  }
}
