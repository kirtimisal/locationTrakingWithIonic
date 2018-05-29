import { Component } from '@angular/core';
import { NavController, ModalController,  ViewController, IonicPage } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { LoginPage } from '../login/login';

@IonicPage()
@Component({
    selector: 'page-login',
    templateUrl: 'ForgotPasswordPage.html'
})

export class ForgotPasswordPage {
    forgotPwdForm: FormGroup;
    shouldHeight: any;
    constructor(public navCtrl: NavController, private fb: FormBuilder, public viewCtrl: ViewController, private globalObjects: GlobalObjectsProvider, public http: Http, public modalCtrl: ModalController) {
        this.forgotPwdForm = this.fb.group({
            'email': [null, Validators.compose([Validators.required])]
        });
        this.shouldHeight = document.body.clientHeight + "px";
    }
    checkMailForResetKey(value) {
        this.globalObjects.showLoading();
        this.http.get(this.globalObjects.getScopeUrl() + "forgotPassword?emailId=" + value.email)
            .map(res => res.json()).subscribe(data => {
                let l_resetPasswordStatus = data.key;
                this.globalObjects.hideLoading();
                if (l_resetPasswordStatus == "Please check your email ,We have send you a unique key,Use this to reset your password") {
                    let checkMailForResetKeyModal = this.modalCtrl.create('CheckMailPage', { email: value.email });
                    checkMailForResetKeyModal.present();
                    this.globalObjects.displayCordovaToast("Please check your email ,We have send you a unique key,Use this to reset your password");
                } else if (l_resetPasswordStatus == "Might be emailId is Wrong ,Please enter valid email ID.") {
                    this.globalObjects.displayCordovaToast(l_resetPasswordStatus)
                } else if (l_resetPasswordStatus == "Not valid emailId") {
                    this.globalObjects.displayCordovaToast(l_resetPasswordStatus)
                } else if (l_resetPasswordStatus == "Fail") {
                } else {
                }
            },
                err => {
                    this.globalObjects.hideLoading();
                });
    }

    closePage() {
        this.viewCtrl.dismiss();
    }
}
