import { Component  } from '@angular/core';
import {  NavController,  NavParams,   ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { HttpClient } from '@angular/common/http';
// import { ErpApprovalItemDeatilsPage } from '../erp-approval-item-deatils/erp-approval-item-deatils'
// import { FileTransfer,  FileTransferObject } from '@ionic-native/file-transfer';
// import { File } from '@ionic-native/file';
import { Http } from '@angular/http';

@IonicPage()
@Component({
    templateUrl: 'previewImage.html'
  })
  export class PreviewModalPage {
    image: any;
    url: any;
    Name: any;
    constructor(public navCtrl: NavController, private params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public http: Http) {
  
    }
    ionViewDidLoad() {
      this.url = this.globalObjects.getScopeUrl();
      var rowId = this.params.get("obj");
      this.Name = this.params.get("Name");
      this.image = this.url + "getDependentDoc?rowId=" + rowId;
    }
    closeModal() {
      this.viewCtrl.dismiss();
    }
  }