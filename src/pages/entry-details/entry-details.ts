import { Component } from '@angular/core';
import {  NavController,   ViewController, NavParams, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';

@IonicPage()
@Component({
    templateUrl: 'entryDetails.html'
  })
  export class EntryDetailsPage {
    updateKeyValue: any;
    entryDetails: any; heading: any; firstScreen: String; flagForUpdateButton: String; sp_obj: any; seqId: any;
    constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public http: Http) {
      this.entryDetails = params.get("obj");
      this.sp_obj = params.get("sp_obj");
      this.seqId = params.get("seqId");
      var l_param = this.globalObjects.getLocallData("tabParam");
      this.firstScreen = l_param.firstScreen;
      this.heading = l_param.heading;
      this.updateKeyValue = params.get('upKey');
      if ((l_param.updation_process).indexOf('U') > -1) {
        this.flagForUpdateButton = 'U#';
      }
    }
    closePage() {
      this.viewCtrl.dismiss();
    }
    openUpdateEntry(listData) {
      var l_param = this.globalObjects.getLocallData("tabParam");
      for (let obj of listData) {
        if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
          l_param.update_key_value = obj.value;
          l_param.update_key_codeOfValue = obj.codeOfValue;
          l_param.seqId = obj.value;
        }
      }
      if (this.sp_obj.types == 'P' || this.sp_obj.types == 'O' || this.firstScreen == 'PO') {
        var l_obj: any = [];
        l_obj.seqNo = this.sp_obj.seqNo;
        l_obj.listData = listData;
        l_obj.types = this.sp_obj.types;
        l_obj.firstScreen = this.firstScreen;
        this.navCtrl.push('EntryDetailsInTabularPage',{obj:l_obj})
      } else {
        l_param.seqId = this.seqId;
        l_param.table_desc = this.sp_obj.table_desc;
        l_param.type = "Update";
        l_param.types = this.sp_obj.types;
        l_param.update_key_value = this.updateKeyValue;
        l_param.dependent_next_entry_seq = this.sp_obj.dependent_next_entry_seq;
        this.globalObjects.setDataLocally("tabParam", l_param);
        this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param });
      }
    }
  }
  
  