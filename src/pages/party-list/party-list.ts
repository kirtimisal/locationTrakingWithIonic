import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';
// import { PartyDetailsPage } from '../party-details/party-details';

/**
 * Generated class for the PartyListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-party-list',
  templateUrl: 'party-list.html',
})
export class PartyListPage {
  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  user_code: string
  url: string;
  slno: string = "";
  userDetails: any = {};
  partyListitems = [];
  pageNo: number = 0;
  showHide: boolean = false;
  searchText: string = "";
  isNoMoreData: boolean = true;
  filterVal: String;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public httpClient: HttpClient, private globalObjects: GlobalObjectsProvider) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
  }

  ionViewDidLoad() {
    this.scrollData('showLoder', '', '', '');
  }
  scrollData(flag, slno, searchText, dataVal) {
    if (flag == 'showLoder') {
      this.globalObjects.showLoading();
    }
    if (dataVal == 'refresh') {
      this.partyListitems = [];
      this.pageNo = 0;
    }

    if (this.filterVal) {
      searchText = this.filterVal;
    }
    if (this.searchText) {
      searchText = this.searchText;
    }

    if (slno) {
      this.slno = slno;
    } else {
      if (this.slno) {
      } else {
        this.slno = "";
      }
    }
    var l_url = this.url + "partyList?seqNo=" + this.l_appSeqNo + "&userCode=" + this.user_code + "&pageNo=" + this.pageNo + "&slno=" + this.slno + "&searchText=" + searchText;
    // console.log(l_url)
    this.httpClient.get(l_url).subscribe(resData => {
      var data: any = resData;
      this.globalObjects.hideLoading();

      if (data.partyList) {
        if (this.partyListitems.length > 0) {
          for (let item of data.partyList) {
            let name = item.partyName.trim();
            item.firstChar = new String(name).charAt(0).toUpperCase();
            this.partyListitems.push(item);
          }
          this.isNoMoreData = false;
        } else {
          for (let item of data.partyList) {
            let name = item.partyName.trim();
            item.firstChar = new String(name).charAt(0).toUpperCase();
          }
          this.partyListitems = data.partyList;
          this.isNoMoreData = false;
        }
      } else {
        this.isNoMoreData = true;
      }
    }, err => {
      this.isNoMoreData = true;
      this.globalObjects.hideLoading();
    })
  }

  doInfinite(infiniteScroll): Promise<any> {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.pageNo = this.pageNo + 1;
        this.scrollData('', this.slno, this.searchText, '');
        infiniteScroll.complete();
      }, 900);
    })
  }

  openPartyDetails(partyCode) {
    var l_obj: any = [];
    l_obj.partyCode = partyCode;
    l_obj.seqNo = this.l_appSeqNo;
    this.navCtrl.push('PartyDetailsPage', { sp_obj: l_obj })
  }

  openFilter() {
    let openFilterModal = this.modalCtrl.create('FilterPage', { obj: this.l_appSeqNo });
    openFilterModal.present();
    openFilterModal.onDidDismiss((slno, searchText) => {

      if (slno) {
        this.pageNo = 0;
        this.partyListitems = [];
        this.scrollData('showLoder', slno, searchText, '');
      } else {
      }

    });
  }
}

