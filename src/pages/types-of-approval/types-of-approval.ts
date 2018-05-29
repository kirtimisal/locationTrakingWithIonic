import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { ErpApprovalListPage } from '../erp-approval-list/erp-approval-list';
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-types-of-approval',
  templateUrl: 'types-of-approval.html',
})
export class TypesOfApprovalPage {
  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  user_code: string
  url: string;
  online: boolean = true;
  userDetails: any = {};
  listOfErpTypes: any = [];
  unapprovedCount: any;
  approvedCount: any;
  approvals: any;
  listLengthVal: any = 0;
  prevlistLengthVal: any = 0;
  listOfPrevErpTypes: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public httpClient: HttpClient, private globalObjects: GlobalObjectsProvider,
    public events: Events) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;

    console.log("userDetails--> " + this.userDetails)
    events.subscribe('erpAppr:statusChanged', (user, time) => {
      this.ionViewDidLoad();
    });
  }

  ionViewDidLoad() {
    this.globalObjects.showLoading();
    this.approvals = 'pending';
    var l_url = this.url + "typesOfApprovals?seqNo=" + this.l_appSeqNo + "&userCode=" + this.user_code + "&entityCode=" + this.userDetails.entity_code;
    this.httpClient.get(l_url).subscribe(resData => {
      var data: any = resData;
      this.globalObjects.hideLoading();
      this.listOfErpTypes = data.typeOfApprovalsList;
      this.listOfPrevErpTypes = data.typeOfPervApprovalsList;
      this.unapprovedCount = data.unapprovedApprovalCount;
      this.approvedCount = data.approvedApprovalCount;
      if (this.listOfErpTypes) {
        this.listLengthVal = this.listOfErpTypes.length;
      }
      if (this.listOfPrevErpTypes) {
        this.prevlistLengthVal = this.listOfPrevErpTypes.length;
      }
    }, err => {
      this.globalObjects.hideLoading();
    })
  }

  getListOfAppr(item, approval) {
    var param: any = this.sp_obj;
    param.tnature = item.tnature_code;
    param.type = approval;
    param.tnature_name = item.tnatrure_Name
    this.navCtrl.push('ErpApprovalListPage', { sp_obj: param })
  }

  back() {
    this.navCtrl.pop()
  }

  refreshApprovalList() {
    this.ionViewDidLoad();
  }

}
