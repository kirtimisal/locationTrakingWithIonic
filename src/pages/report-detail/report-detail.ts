import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
// import { PopoverController } from 'ionic-angular';
// import { PouchDBService } from '../../providers/pouchDB/pouchServies';


@IonicPage()
@Component({
    templateUrl: 'reportDetails.html',
    selector: 'page-report-analysis'
  })
  export class ReportDetailPage {
    reportValues: any = [];
    login_params: any;
    url: any;
    valueFlaglength: any = 0;
    entryDetails: any; heading: any; firstScreen: String; flagForUpdateButton: String; sp_obj: any; seqId: any;
    constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public http: Http) {
      this.sp_obj = params.get("obj");
      this.url = this.globalObjects.getScopeUrl();
      this.login_params = this.globalObjects.getLocallData("userDetails");
    }
    ionViewDidLoad() {
      var l_url = this.url + "reportFilterForm?userCode=" + this.login_params.user_code + '&seqNo=' + this.sp_obj.seq_no;
      this.http.get(l_url).map(res => res.json()).subscribe(data => {
        if (data.recordsInfo) {
          this.reportValues = JSON.parse(JSON.stringify(data.recordsInfo));
          var valueFlag: any = [];
          for (let obj of this.reportValues) {
            if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
              if (obj.value) {
                valueFlag.push({ 'para_desc': obj.para_desc, 'value': obj.value });
              }
            }
          }
          this.valueFlaglength = valueFlag.length;
        }
      }, err => { })
    }
    closePage() {
      this.viewCtrl.dismiss();
    }
  }
  
  