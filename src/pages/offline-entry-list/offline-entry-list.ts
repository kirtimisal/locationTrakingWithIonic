import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';
import { DataServicesProvider } from '../../providers/data-services/data-services';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { AddUpdateEntryPage } from '../add-update-entry/add-update-entry';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
// import { PopulatedOrderEntryFormPage } from '../populated-order-entry/populated-order-entry';
// import { LocationPopulatedEntryPage } from '../location-populated-entry/location-populated-entry';
// import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'offline-entry-list.html',
})
export class OfflineEntryListPage {
  sp_obj;
  flagForUpdateButton;
  flagForApproveButton;
  flagForDeleteButton;
  flagForUploadButton;
  flagForUploadAllButton;
  l_flagforPopulatedForm;
  defaultPopulateDataLength;
  uploadEntryStatus;
  entryDetail: any = [];
  listOfEntries;
  online: boolean;
  url;
  appType;
  fieldsTH;
  l_object;

  constructor(public navCtrl: NavController, public navParams: NavParams, private addUpdateEntryServices: AddUpdateEntryServicesProvider,
    public pouchDBService: PouchDBService, public globalObjects: GlobalObjectsProvider, 
    public dataServices: DataServicesProvider) {
    this.url = this.globalObjects.getScopeUrl();
    this.appType = this.globalObjects.getLocallData('apptype');
    this.online = this.globalObjects.getOnlineStatus();
    this.addUpdateEntryServices.getLatLongTimestamp().then(data => {
      this.l_object = data;
    });
  }

  ionViewDidLoad() {
    this.sp_obj = this.navParams.get('obj');
    this.flagForUpdateButton = 'U#';
    this.flagForApproveButton = '';
    this.flagForDeleteButton = 'D#';
    this.flagForUploadButton = "UP#";
    this.flagForUploadAllButton = 'UPA#';
    this.l_flagforPopulatedForm = 1;
    if (this.sp_obj.default_populate_data == null || this.sp_obj.default_populate_data == '' ||
      this.sp_obj.default_populate_data == "null") {
      this.flagForUploadAllButton = 'UPA#';
    } else {
      this.flagForUploadAllButton = "";
      this.l_flagforPopulatedForm = 0;
    }
    if (this.sp_obj.firstScreen == "PO") {
      this.flagForUpdateButton = '';
      this.flagForApproveButton = '';
      this.flagForDeleteButton = 'D#';
      this.flagForUploadButton = "UP#";
      this.flagForUploadAllButton = '';
    }

    var fieldsTH = "";
    var defaultPopulateDataLength = "";
    var uploadEntryStatus = "";
    var id = "entrySeqNo" + this.sp_obj.seqNo;
    this.pouchDBService.getObject(id).then(dta => {
      var data: any = dta;
      this.listOfEntries = data.entryList;
      fieldsTH = data.fieldsTH;
      defaultPopulateDataLength = data.defaultPopulateDataLength;
      uploadEntryStatus = data.uploadEntryStatus;
      if (this.listOfEntries) {
        if (this.listOfEntries[0].headEntry) {
          this.flagForUploadAllButton = "";
        }
      }
    }, err => { });
  }

  uploadAllEntry() {
    if (this.online) {
      this.dataServices.uploadAllEntry(this.listOfEntries, this.sp_obj.seqNo, this.url, this.appType).then(data => {
        this.deleteAllEntry1();
        this.globalObjects.displayCordovaToast('Entry uploaded sucessfully...')
      }, err => {
        this.globalObjects.displayCordovaToast('Try Again..')
      });
    } else {
      this.globalObjects.displayCordovaToast('Network is not available...')
    }
  }

  uploadEntry(item, index) {
    if (this.online) {
      if (this.l_flagforPopulatedForm == 0 || this.sp_obj.firstScreen == "PO") {
        this.sp_obj.seqNo + 0.2;
        this.dataServices.uploadAllEntry(item, (parseInt(this.sp_obj.seqNo) + 0.2).toFixed(1), this.url, this.appType).then(dta => {
          let data: any = dta;
          if (data.status == "insert data") {
            this.deleteEntry1(item, index);
            this.globalObjects.displayCordovaToast('Entry uploaded sucessfully...')
          } else {
            this.globalObjects.displayCordovaToast(data.status);
          }
        }, function (err) {
          this.globalObjects.displayCordovaToast('Try Again..')
        });
      } else {
        if (item.headEntry) {
          var temp = "offlineEntry";
          var tempSeqNo = (parseInt(this.sp_obj.seqNo) + 0.1)
          this.dataServices.uploadEntry(item.headEntry, this.sp_obj.seqNo, this.url, this.l_object.latitude, this.l_object.longitude, this.l_object.location, '', this.sp_obj.seqNo, this.sp_obj.seqNo, '', '', '', '').then(data => {
            tempSeqNo = (parseInt(this.sp_obj.seqNo) + 0.2)
            if (item.orderEntry == "") {
              this.deleteEntry1(item, index);
              this.globalObjects.displayCordovaToast('Entry uploaded sucessfully...')
            } else {
              this.dataServices.uploadAllEntry(item.orderEntry, tempSeqNo, this.url, temp).then(data => {
                this.deleteEntry1(item, index);
                this.globalObjects.displayCordovaToast('Entry uploaded sucessfully...')
              }, err => {
                this.globalObjects.displayCordovaToast('Try Again..')
              });
            }
          }, err => {
            this.globalObjects.displayCordovaToast('Try Again..');
          });
        } else {
          this.dataServices.uploadEntry(item, this.sp_obj.seqNo, this.url, this.l_object.latitude, this.l_object.longitude, this.l_object.location, '', this.sp_obj.seqNo, this.sp_obj.seqNo, '', '', '', '').then(data => {
            this.globalObjects.displayCordovaToast('Entry uploaded sucessfully...')
            this.deleteEntry1(item, index);
          }, err => {
            this.globalObjects.displayCordovaToast('Try Again..')
          });
        }
      }
    } else {
      this.globalObjects.displayCordovaToast('Network is not available...')
    }
  }

  deleteEntry(item, index) {
    let cnfAlert = this.globalObjects.confirmationPopup('Do you want to Delete Entry?');
    cnfAlert.present();
    cnfAlert.onDidDismiss((data) => {
      if (data == true) {
        this.deleteEntry1(item, index);
      } else { }

    })
  }
  deleteEntry1(item, index) {
    this.dataServices.deleteEntry(item, this.sp_obj.seqNo, index).then(data => {
      this.pouchDBService.getObject("entrySeqNo" + this.sp_obj.seqNo).then(dta => {
        let data: any = dta;
        this.listOfEntries = data.entryList;
        this.globalObjects.displayCordovaToast('Entry Deleted Successfully..')
        this.ionViewDidLoad();
      }, err => {
        this.globalObjects.displayCordovaToast('Try Again..')
      });
    }, err => {
      this.globalObjects.displayCordovaToast('Try Again..')
    });
  }

  deleteAllEntry1() {
    this.dataServices.deleteAllEntry(this.sp_obj.seqNo).then(data => {
      this.pouchDBService.getObject("entrySeqNo" + this.sp_obj.seqNo).then(dta => {
        let data: any = dta;
        this.listOfEntries = data.entryList;
        this.globalObjects.displayCordovaToast('Entry Deleted Successfully..');
        this.navCtrl.setRoot('HomePage');
      }, err => {
        this.globalObjects.displayCordovaToast('Try Again..')
      });
    }, err => {
      this.globalObjects.displayCordovaToast('Try Again..')
    });
  }

  openUpdateEntry(listData, index) {
    var l_param: any = [];
    l_param.headEntry = listData.headEntry;
    l_param.orderEntry = listData.orderEntry;
    l_param.recordsInfo = listData;
    l_param.index = index;
    l_param.seqNo = this.sp_obj.seqNo;
    l_param.updation_process = ""
    l_param.table_desc = this.sp_obj.table_desc;
    l_param.type = "offlineUpdateEntry";
    if (this.sp_obj.firstScreen == 'O') {
      l_param.flagFororder = 1;
    } else {
      l_param.flagFororder = 0;
    }
    if (this.uploadEntryStatus) {
      l_param.defaultPopulateDataLength = this.defaultPopulateDataLength;
      l_param.uploadEntryStatus = this.uploadEntryStatus;
      l_param.fieldsTH = this.fieldsTH;
      this.navCtrl.push('LocationPopulatedEntryPage', { obj: l_param });

    } else {
      if (this.l_flagforPopulatedForm == 0) {
        l_param.types = 'P';
        l_param.fieldsTH = this.fieldsTH;
        this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: l_param });

      } else {
        this.globalObjects.setDataLocally('TabParam', l_param);
        this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param });
      }
    }
  }

}
