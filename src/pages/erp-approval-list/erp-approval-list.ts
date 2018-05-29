import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { ErpApprovalDeatilsPage } from '../erp-approval-deatils/erp-approval-deatils'
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-erp-approval-list',
  templateUrl: 'erp-approval-list.html'
})
export class ErpApprovalListPage {
  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  user_code: string
  url: string;
  online: boolean = true;
  userDetails: any = {};
  listOfErpAppr: any = [];
  tnature_name: any;
  listLength: any;
  showHide: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private globalObjects: GlobalObjectsProvider,
    public events: Events) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
    this.tnature_name = this.sp_obj.tnature_name;
    events.subscribe('erpAppr:statusChanged', (user, time) => {
      this.ionViewDidLoad();
    });
  }

  ionViewDidLoad() {
    this.globalObjects.showLoading();
     var l_url = this.url + "listOfApprovals?entityCode=" + encodeURIComponent(this.userDetails.entity_code) +
    "&userCode=" + this.user_code + "&tnature=" + this.sp_obj.tnature + "&type=" + this.sp_obj.type;
    this.httpClient.get(l_url)
      .subscribe(resData => {
        var data: any = resData;
        this.globalObjects.hideLoading();
        this.listOfErpAppr = data.listOfApprovals;
        this.listLength = this.listOfErpAppr.length;
      }, err => {
        this.globalObjects.hideLoading();
      })
  }

  getErpApprDetails(item) {
    this.sp_obj.erpItem = item
    this.navCtrl.push('ErpApprovalDeatilsPage', { sp_obj: this.sp_obj });
  }

  back() {
    this.navCtrl.pop();
  }

}

