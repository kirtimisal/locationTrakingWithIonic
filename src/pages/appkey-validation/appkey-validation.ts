import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Device } from '@ionic-native/device';
/**
 * Generated class for the AppkeyValidationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-appkey-validation',
  templateUrl: 'appkey-validation.html',
})
export class AppkeyValidationPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public globalObjects: GlobalObjectsProvider,
    private device: Device, public httpClient: HttpClient, public viewCtrl: ViewController) {
  }

  save(appkey) {
    // var url = " http://192.168.100.195:9090/DynamicAppWS/webService/getServerDetails?appKey=" + appkey +
    var url = "http://203.193.167.118:8888/DynamicAppWSV3/webService/getServerDetails?appKey=" + appkey +
      "&device_id=" + this.device.uuid + "&device_name=" + this.device.model;
    this.httpClient.get(url).subscribe(data => {
      var resData: any = data;
      if (resData.status == "true") {
        // alert(resData.dbName);
        var server_url = "http://" + resData.serverUrl + "/" + resData.war_name + "/webService/" + resData.entity + "/" + resData.dbUrl + "/" + resData.portNo + "/" + resData.dbName + "/" + resData.dbPassword + "/";
        console.log(server_url);
        this.globalObjects.setDataLocally("isAppLaunch", true);
        this.globalObjects.setDataLocally("scopeUrl", server_url);
        this.globalObjects.setScopeUrl(server_url);
        this.navCtrl.setRoot('LoginPage');
      } else {
        this.globalObjects.displayCordovaToast(resData.msg);
      }
      this.globalObjects.setDataLocally("device_validation", resData.device_validation);
    }, err => {
      console.log(err);
      this.globalObjects.displayCordovaToast("Something went wrong please try again later!");
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AppkeyValidationPage');
  }

}
