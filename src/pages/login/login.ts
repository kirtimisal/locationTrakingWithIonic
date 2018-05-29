import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, IonicPage, ModalController } from 'ionic-angular';
// import { HomePage } from '../home/home';
// import { ForgotPasswordPage } from '../ForgotPasswordPage/ForgotPasswordPage';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { ChangeServerSettingPage } from '../change-server-setting/change-server-setting';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  public loginCredentials: any = {};
  public loginValid: any = {};
  online: any;
  flagForDisableLoginButton = 0;
  public shouldHeight: any;
  constructor(public httpClient: HttpClient, private device: Device,
    private menuCtrl: MenuController, public navCtrl: NavController, public navParams: NavParams,
    public globalObjects: GlobalObjectsProvider, public modalCtrl: ModalController) {
    this.online = this.globalObjects.getOnlineStatus();
    this.shouldHeight = document.body.clientHeight + 'px';
  }

  forgotPassword() {
    this.navCtrl.push('ForgotPasswordPage');
  }
  doLogin() {
    var s_url: any = this.globalObjects.getScopeUrl();

    if (this.loginCredentials.ip1 && this.loginCredentials.ip2 && this.loginCredentials.ip3 && this.loginCredentials.ip4) {

      var temp_url = this.globalObjects.getScopeUrl();
      var url_1 = temp_url.split(":")[0]
      var url_2 = temp_url.split(":")[1]
      var url_3 = temp_url.split(":")[2]
      var bb = url_2.split(".")[0];
      var url_2_2 = bb.split("")[0] + bb.split("")[1] + this.loginCredentials.ip1 + "." + this.loginCredentials.ip2 + "." + this.loginCredentials.ip3 + "." + this.loginCredentials.ip4;
      s_url = url_1 + ":" + url_2_2 + ":" + url_3;

    }

    if (this.globalObjects.getLocallData("device_validation") == "Y") {
      var url = s_url + 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) + '&deviceId=' + this.device.uuid + '&deviceName=' + this.device.model + '&notificationToken=';
    } else {
      var url = s_url + 'login?userId=' + (this.loginCredentials.user_code).trim() + '&password=' + encodeURIComponent(this.loginCredentials.password) + '&deviceId=d79e928c5b0201b1' + '&deviceName=Micromax AQ4501' + '&notificationToken=';
    }

    console.log(url)
    if (this.online) {
      this.flagForDisableLoginButton = 1;
      this.httpClient.get(url).subscribe(data => {
        this.loginValid = data;
        if (this.loginValid.message === "User is authenticated") {
          var division_data = "";
          if (this.loginValid.division) {
            if (this.loginValid.division.indexOf(" ") > -1) {
              division_data = this.loginValid.division.split(" ")[0];
            } else {
              division_data = this.loginValid.division;
            }
          }
          var currentDate = new Date();
          var getMonth = currentDate.getMonth() + 1;
          var getYear = currentDate.getFullYear().toString().substr(2, 2);
          var acc_year;
          var fst, scnd;
          if (getMonth == 1 || getMonth == 2 || getMonth == 3) {
            fst = (parseInt(getYear) - 1);
            scnd = (parseInt(getYear));
            acc_year = fst + " " + scnd;
          } else {
            scnd = (parseInt(getYear));
            fst = (parseInt(getYear) + 1);
            acc_year = fst + " " + scnd;
          }
          this.loginValid.division_data = division_data;
          this.loginValid.acc_year = acc_year;
          this.loginValid.password = this.loginCredentials.password;

          if (this.loginValid.entity_code) {
            var dataSplit;
            if (this.loginValid.entity_code.indexOf("#") > -1) {
              dataSplit = this.loginValid.entity_code.split("#");
              this.loginValid.entity_code = dataSplit[0];
            } else if (this.loginValid.entity_code.indexOf(",") > -1) {
              dataSplit = this.loginValid.entity_code.split(",");
              this.loginValid.entity_code = dataSplit[0];
            } else if (this.loginValid.entity_code.indexOf(" ") > -1) {
              dataSplit = this.loginValid.entity_code.split(" ");
              this.loginValid.entity_code = dataSplit[0];
            }
          }
          this.globalObjects.setDataLocally("userDetails", this.loginValid);
          this.globalObjects.setDataLocally("apptype", this.loginValid.module);
          this.globalObjects.setScopeUrl(s_url);
          this.navCtrl.setRoot('HomePage');

        } else {
          this.flagForDisableLoginButton = 0;
          this.globalObjects.displayCordovaToast(this.loginValid.message);
        }
      }, err => {
        this.flagForDisableLoginButton = 0;
        this.globalObjects.displayErrorMessage(this.loginValid.message);
      })
    } else {
      this.flagForDisableLoginButton = 0;
      this.globalObjects.displayCordovaToast("Please Check Internet Connectivity..");
    }
  }
  changeSetting() {
    this.navCtrl.push('ChangeServerSettingPage');
  }
  ionViewDidLoad() {
    this.menuCtrl.swipeEnable(false);
  }
}


