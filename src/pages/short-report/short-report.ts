import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { ShortReportDetailPage } from '../short-report-detail/short-report-detail';

@IonicPage()
@Component({
  selector: 'page-short-report',
  templateUrl: 'short-report.html',
})
export class ShortReportPage {
  sp_obj: any; typeList: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public globalObjects: GlobalObjectsProvider) {
    this.sp_obj = navParams.get("obj");
  }

  ionViewDidLoad() {
    var url = this.globalObjects.getScopeUrl() + "shortReportType?seqNo=" + this.sp_obj.seqNo;
    this.http.get(url).map(res => res.json()).subscribe(dataVal => {
      this.typeList = dataVal.tabList;
    }, err => { })
  }

  openShortReportDetail(seqNo) {
    this.navCtrl.push('ShortReportDetailPage',{obj:seqNo})
  }

}
