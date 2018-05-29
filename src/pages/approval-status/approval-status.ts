import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';

/**
 * Generated class for the ApprovalStatusPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-erp-approval-deatils',
  templateUrl: 'approval-status.html'
})
export class ApprovalStatusPage {
sp_obj;
approvalStatus:any=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, private globalObjects: GlobalObjectsProvider,public httpClient: HttpClient) {
    this.sp_obj=this.navParams.get("sp_obj");
  }

  ionViewDidLoad() {
    let userDetails = this.globalObjects.getLocallData("userDetails");
    let url = this.globalObjects.getScopeUrl();
    let l_url=url+"getApprovalStatus?userCode="+userDetails.user_code+"&entityCode="+userDetails.entity_code+"&tCode="+this.sp_obj.erpItem.tCode+"&VRNO="+this.sp_obj.erpItem.vrno;
    this.globalObjects.showLoading();
    this.httpClient.get(l_url)
    .subscribe(resData => {
      var data: any = resData;
      this.approvalStatus=data;
      this.globalObjects.hideLoading();
    }, err => {
      this.globalObjects.hideLoading();
    })
  }

}
