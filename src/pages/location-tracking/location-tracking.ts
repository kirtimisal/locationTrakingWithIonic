import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';

@IonicPage()
@Component({
  selector: 'page-location-tracking',
  templateUrl: 'location-tracking.html',
})
export class LocationTrackingPage {
  lt: any = []; sp: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalObjects: GlobalObjectsProvider) {
  }

  ionViewDidLoad() {
    this.sp = this.globalObjects.getLocallData("tabParam");
    this.lt.disableTracking = this.globalObjects.getLocallData("locationTracking");
    this.lt.table_desc = this.sp.table_desc;
    this.lt.isStart = this.globalObjects.getLocallData("locationTracking");
  }
  startLT() {
    var interval;
    if (this.sp.replicate_fields) {
      interval = 1000 * 60 * parseInt(this.sp.replicate_fields); // convert milliseconds to mint 
      if (interval) {
        this.globalObjects.setDataLocally("locationTracking", true);
        this.lt.disableTracking = this.globalObjects.getLocallData("locationTracking");
        var url = this.globalObjects.getScopeUrl();
        var spliturl = url.split("/");
        let appStarter = (window as any).startApp.set({
          "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.StartLocTracAndHideActivity"]
        }, {
            "INTERVAL": interval,
            "USERCODE": this.globalObjects.getLocallData("userDetails").user_code,
            "ENTITYCODE": this.globalObjects.getLocallData("userDetails").entity_code,
            "DBUSER": spliturl[8],
            "DBPASSWORD": spliturl[9],
            "SEQNO": this.globalObjects.getLocallData("AppSeqNO"),
            "DBURL": spliturl[6],
            "DBPORTNO": spliturl[7],
            "URL": url
          });
        appStarter.start((msg) => {
        }, (err) => {
        });
      } else {
        this.globalObjects.displayCordovaToast("Interval is not defined");
      }
    } else {
      this.globalObjects.displayCordovaToast("Interval is not defined");
    }
  }

  stopLT() {
    this.globalObjects.setDataLocally("locationTracking", false);
    this.lt.disableTracking = this.globalObjects.getLocallData("locationTracking");
    let appStarter = (window as any).startApp.set({
      "component": ["com.lhs.foregroundexample", "com.lhs.foregroundexample.UnHideActivity"]
    });
    appStarter.start((msg) => {
    }, (err) => {
    });
  }

}
