import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { LoginPage } from '../login/login';

@IonicPage()
@Component({
  selector: 'page-change-server-setting',
  templateUrl: 'change-server-setting.html',
})
export class ChangeServerSettingPage {
  authPinForm: FormGroup;
  constructor(public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, public globalObjects: GlobalObjectsProvider, public modalCtrl: ModalController) {
    this.authPinForm = this.fb.group({
      'authPin': [null, Validators.compose([Validators.required])]
    });
  }
  checkAuthPin(value) {
    if (value.authPin == '007') {
      let serverSettingModal = this.modalCtrl.create('ServerSettingPage', {});
      serverSettingModal.present();
      serverSettingModal.onDidDismiss(fieldsData => {
        this.navCtrl.setRoot('LoginPage');
      });
    } else {
      this.globalObjects.displayCordovaToast("setting saved successfully");
      this.navCtrl.setRoot('LoginPage');
    }
  }

  changeAppKey() {
    this.navCtrl.setRoot('AppkeyValidationPage');
  }

  ionViewDidLoad() {
  }
  cancelPage() {
    this.navCtrl.pop();
  }
}
