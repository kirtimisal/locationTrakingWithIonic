import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';
// import { PartyDetailsPage } from '../party-details/party-details';

@IonicPage()
@Component({
  selector: 'page-party-list',
  templateUrl: 'filterPage.html'
})
export class FilterPage {
  list: any = [];
  seq_no: any; url: any;
  userDetails: any;
  constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public httpClient: HttpClient) {
    this.seq_no = params.get('obj');
    this.url = this.globalObjects.getScopeUrl();
    this.userDetails = this.globalObjects.getLocallData("userDetails");
  }

  ionViewDidLoad() {
    var l_url = this.url + "getPartyFilters?seqNo=" + this.seq_no;
    this.httpClient.get(l_url).subscribe(resData => {
      // var data: any = resData;
      this.list = resData;
    }, err => {
    })
  }
  closePage(seqId, searchText) {
    this.viewCtrl.dismiss(seqId, searchText);
  }

  openLov(item) {
    if (!item.isShow) {
      var l_url = this.url + "getPartyFiltersLOV?seqNo=" + this.seq_no + "&slno=" + item.slno + "&userCode=" + this.userDetails.user_code;
      this.httpClient.get(l_url).subscribe(resData => {
        var data: any = resData;
        for (let itemList of this.list) {
          if (itemList.slno == item.slno) {
            itemList.lovList = data;
          }
        }
        console.log(data);
      }, err => {
      })
      item.isShow = true;
    } else {
      item.isShow = false;
    }
  }

}

