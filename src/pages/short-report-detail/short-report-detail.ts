import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';

@IonicPage()
@Component({
  selector: 'page-short-report-detail',
  templateUrl: 'short-report-detail.html',
})
export class ShortReportDetailPage {
  seqNo: any; shortReportProcess = false; shortReportDetail: any;
  constructor(public navCtrl: NavController, private http: Http, public navParams: NavParams, public globalObjects: GlobalObjectsProvider) {
    this.seqNo = navParams.get("obj");
  }

  ionViewDidLoad() {
    var url = this.globalObjects.getScopeUrl() + "shortReportSubType?seqId=" + this.seqNo;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.shortReportDetail = data.subTab;
    }, err => { })
  }

  openShortReport(seqNo, slno, status) {
    if (status) {
      var url = this.globalObjects.getScopeUrl() + "shortReportDetail?seqId=" + seqNo + "&slNo=" + slno;
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.shortReportDetail.forEach(function (obj) {
          if (obj.slno == slno) {
            obj.shortReprt = data.value;
            obj.shortReportProcess = false;
          }
        })
      }, err => { })
    }
  }

}
