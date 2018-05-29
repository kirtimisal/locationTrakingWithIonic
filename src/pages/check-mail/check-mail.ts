import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { LoginPage } from '../login/login';

@IonicPage()
@Component({
    templateUrl: 'passwordReset.html'
})
export class CheckMailPage {
    emailVal: any;
    resetPwdForm: FormGroup;
    loading: any;
    constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, private fb: FormBuilder, public http: Http, public modalCtrl: ModalController) {
        this.resetPwdForm = this.fb.group({
            'password': [null, Validators.compose([Validators.required])],
            'otp': [null, Validators.compose([Validators.required])]

        });
        this.emailVal = params.get('email');
    }

    passwordReset(value) {
        this.globalObjects.showLoading();

        this.http.get(this.globalObjects.getScopeUrl() + "resetPasword?emailId=" + this.emailVal + "&password=" + value.password + "&key=" + value.otp)
            .map(res => res.json()).subscribe(data => {
                let l_setNewPasswordStatuss = data.result;
                this.globalObjects.hideLoading();
                if (l_setNewPasswordStatuss == "success") {
                    this.viewCtrl.dismiss();
                    this.globalObjects.displayCordovaToast("Password updated successfully");
                    this.navCtrl.setRoot('LoginPage');
                } else if (l_setNewPasswordStatuss == "not valid") {
                    this.globalObjects.displayCordovaToast("Reset Key Expired, try requesting new Reset Key")
                } else if (l_setNewPasswordStatuss == "fail") {
                    this.globalObjects.displayCordovaToast("Please Enter Correct Reset Key")
                } else {
                    this.globalObjects.displayCordovaToast("Please Enter Correct Reset Key")
                }
            },
                err => {
                    this.globalObjects.hideLoading();
                    this.globalObjects.displayCordovaToast("Error Occured while updating password")
                });
    }

    closePage() {
        this.viewCtrl.dismiss();
    }
}

