import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-image-entry',
  templateUrl: 'image-entry.html',
})
export class ImageEntryPage {
  imageDetails: any;
  online: any;
  replaceArr: any;
  l_userCode;
  l_appSeqNo;
  sp_obj;
  l_url;
  table_desc;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private globalObjects: GlobalObjectsProvider) {
    this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
    this.sp_obj = this.navParams.get('sp_obj');
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
    this.l_url = this.globalObjects.getScopeUrl();
    this.online  = this.globalObjects.getOnlineStatus();
    var replaceParameter = "";

    for (let element of this.sp_obj.headEntryFieldsData) {
      if (element.valueToSend) {
        this.replaceArr[element.column_name] = element.valueToSend
      }
    }

    for (let value1 of this.replaceArr) {
      if (replaceParameter) {
        replaceParameter = replaceParameter + "#" + value1;
      } else {
        replaceParameter = value1
      }
    }

    var url = this.l_url + 'getDependentImage?seqNo=' + this.l_appSeqNo + '&replaceParameter=' + replaceParameter;
    if (this.online) {
      this.globalObjects.showLoading();
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.globalObjects.hideLoading();
        this.imageDetails = data.dependentImages;
        if (!this.imageDetails) {
          this.globalObjects.displayCordovaToast("Data not Available");
        }
      }, err => {
        this.globalObjects.hideLoading();
        this.globalObjects.displayCordovaToast("Data not Available");
      })
    } else {
      this.globalObjects.displayCordovaToast("Network Not Available");
    }

  }

}
