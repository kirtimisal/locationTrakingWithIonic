import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
// import { AddUpdateEntryPage } from '../add-update-entry/add-update-entry';

@IonicPage()
@Component({
  selector: 'page-hot-seat-entry',
  templateUrl: 'hot-seat-entry.html',
})
export class HotSeatEntryPage {
  constructor(public navCtrl: NavController, public navParams: NavParams, public globalObjects: GlobalObjectsProvider, private http: Http) {
  }

  l_obj: any = [];
  isenabled = true;
  datess = new Date();
  sp = this.globalObjects.getLocallData('tabParam');
  interval;

  ionViewDidLoad() {
    this.l_obj = this.navParams.get('h_obj');
  }

  ionViewDidLeave() {
    this.isenabled = true;
    clearInterval(this.interval);
  }

  start() {
    this.isenabled = false;
    this.interval = setInterval(this.callAtInterval, (1000 * parseFloat(this.sp.replicate_fields)));
    this.callAtInterval();
  }

  callAtInterval() {
    let url = this.globalObjects.getScopeUrl() + 'hotSeatVRNO?userCode=' + this.globalObjects.getLocallData('userDetails').user_code;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if (data.vrno !== "Not Available") {

        this.sp.imgs = data.imgs;
        this.sp.vrno = data.vrno
        this.sp.type = "H";
        this.globalObjects.setDataLocally('tabParam', this.sp);
        this.navCtrl.push('AddUpdateEntryPage', { sp_obj: this.sp });
        this.stop();
      }
    }, err => {
      this.globalObjects.hideLoading();
    })
  }

  stop() {
    this.isenabled = true;
    clearInterval(this.interval);

  }

}
