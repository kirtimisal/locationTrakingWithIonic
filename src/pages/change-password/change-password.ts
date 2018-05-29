import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map';
// import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  changePasswordForm: FormGroup;
  resultData: any = {};
  constructor(public http: Http, public httpClient: HttpClient, public navCtrl: NavController, public navParams: NavParams, private fb: FormBuilder, private globalObjects: GlobalObjectsProvider) {
    this.changePasswordForm = this.fb.group({
      'oldPassword': [null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(3)])],
      'newPassword': [null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(3)])],
      'confPassword': [null, Validators.compose([Validators.required, Validators.maxLength(10), Validators.minLength(3)])]
    });
  }

  changePassword(value) {

    if (value.newPassword == value.confPassword) {
      this.globalObjects.showLoading();
      var url = this.globalObjects.getScopeUrl() + "changePassword?userId=" + this.globalObjects.getLocallData("userDetails").user_code + "&oldPassword=" +
        value.oldPassword + "&newPassword=" + value.newPassword;

      this.httpClient.get(url)
        .subscribe(data => {
          this.globalObjects.hideLoading();
          this.resultData = data;
          this.globalObjects.displayCordovaToast(this.resultData.result)
          if (this.resultData.status === "success") {
            this.navCtrl.setRoot('HomePage');
          }
        }, err => {
          this.globalObjects.hideLoading();
          this.globalObjects.displayCordovaToast('Some error occured while changing password');
        })
    } else {
      this.changePasswordForm.patchValue({ confPassword: '' });
      this.globalObjects.displayCordovaToast('Confirm password does not match...');
    }
  }
  ionViewDidLoad() {
  }

}
