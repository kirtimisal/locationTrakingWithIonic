import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
import { LocationEntryServicesProvider } from '../../providers/location-entry-services/location-entry-services';
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';
// import { TextAreaPopoverPage } from '../text-area-popover/text-area-popover';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

declare var google;

@IonicPage()
@Component({
  selector: 'page-location-populated-entry',
  templateUrl: 'location-populated-entry.html',
})
export class LocationPopulatedEntryPage {
  nameOfColumn: any;
  defaultPopulateData: any = [];
  url: string;
  flagForEntryListButton: string;
  table_desc: any;
  l_appSeqNo: any;
  l_userCode: any;
  sp_Obj: any = []; fields: any = [];
  online: boolean; rowsOfPopulateData: any = []; defaultPopulateDataLength: any; uploadEntryStatus: any = [];
  searchEntity: any = []; listOfEntry: any = []; fieldsTH: any = [];
  constructor(public navCtrl: NavController,  public navParams: NavParams, public modalCtrl: ModalController, private addUpdateEntryServices: AddUpdateEntryServicesProvider,
    private http: Http, private globalObjects: GlobalObjectsProvider, private locationService: LocationEntryServicesProvider, private pouchDBService: PouchDBService) {
    this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
    this.l_appSeqNo = this.globalObjects.getLocallData("AppSeqNO");
    this.sp_Obj = this.navParams.get("obj");
    this.table_desc = this.sp_Obj.table_desc;
    this.url = this.globalObjects.getScopeUrl();
    this.online  = this.globalObjects.getOnlineStatus();
  }

  ionViewDidLoad() {

    if ('V' == this.globalObjects.getLocallData("screenOrientation")) {
      // window.screen.lockOrientation('portrait');
    } else {
      if ("H" == this.globalObjects.getLocallData("screenOrientation")) {
        // window.screen.lockOrientation('landscape');
      }
    }
    if ((this.sp_Obj.updation_process).indexOf('V') > -1) {
      this.flagForEntryListButton = 'V#';
    }

    if (this.online) {
      if (this.sp_Obj.type == "offlineUpdateEntry") {
        this.rowsOfPopulateData = this.sp_Obj.recordsInfo;
        this.defaultPopulateDataLength = this.sp_Obj.defaultPopulateDataLength;
        this.fieldsTH = this.sp_Obj.fieldsTH;
        this.uploadEntryStatus = this.sp_Obj.uploadEntryStatus;
      } else {
        var l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.l_userCode;
        l_url = l_url + "&accCode=" + this.globalObjects.getLocallData("userDetails").acc_code + "&searchText=";
        this.http.get(l_url)
          .map(res => res.json()).subscribe(data => {
            this.fields = data.recordsInfo;
            this.defaultPopulateData = data.defaultPopulateData;
            this.setinfo();
          }, err => { this.globalObjects.displayCordovaToast("Try Again.."); });
      }
    } else {
      if (this.sp_Obj.type == "offlineUpdateEntry") {
        this.rowsOfPopulateData = this.sp_Obj.recordsInfo;
        this.defaultPopulateDataLength = this.sp_Obj.defaultPopulateDataLength;
        this.fieldsTH = this.sp_Obj.fieldsTH;
        this.uploadEntryStatus = this.sp_Obj.uploadEntryStatus;
      } else {
        var id = this.l_appSeqNo.toString();
        id = id + "_seqNo";
        this.pouchDBService.getObject(this.l_appSeqNo + "_seqNo").then(dataObj => {
          var data: any = [];
          data = JSON.parse(JSON.stringify(dataObj));
          this.fields = data.recordsInfo;
          this.defaultPopulateData = data.defaultPopulateData;
          this.setinfo();
        }, err => {
          let alertVal = this.globalObjects.showAlert("Data is not available please REFRESH app");
          alertVal.present();
        })
      }
    }

  }

  setinfo() {
    this.addUpdateEntryServices.setDataCommon(this.fields, this.sp_Obj.vrno, "", "", "", "").then(fields => {
      this.fields = fields;
      var temp: any = []
      this.locationService.setinfo(this.fields, this.defaultPopulateData).then(tempVal => {
        temp = tempVal;
        this.rowsOfPopulateData = temp.rowsOfPopulateData;
        this.defaultPopulateDataLength = temp.defaultPopulateDataLength;
        this.fieldsTH = temp.fieldsTH;
        this.uploadEntryStatus = temp.uploadEntryStatus;
      })
    });
  }

  saveLocation(column_name, index, item) {
    for (var i = 0; i < this.defaultPopulateDataLength; i++) {
      var temp1 = this.rowsOfPopulateData[i];
      if (temp1) {
        for (let obj of temp1) {
          if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
            if (i == index || i == (index - 1) || i == (index + 1)) {
              obj.entry_by_user = "T";
            } else {
              obj.entry_by_user = "R";
            }
          }
          if (i == index) {
            if (obj.column_desc == "Entry Date") {
              obj.value = this.globalObjects.formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss');
            }
            item = temp1;
          }
        }
        this.rowsOfPopulateData.splice(i, 1, temp1);
      }
    }
    var l_latitude;
    var l_longitude;
    this.addUpdateEntryServices.getLatLongTimestamp().then(object => {
      var data: any = object;
      l_latitude = data.latitude;
      l_longitude = data.longitude;
      var tempDate = this.globalObjects.formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss');
      temp1.push({ column_name: "LATITUDE", entry_by_user: "F", value: l_latitude });
      temp1.push({ column_name: "LONGITUDE", entry_by_user: "F", value: l_longitude });
      temp1.push({ column_name: "LOCATION_DATETIME", entry_by_user: "F", value: tempDate });
      this.getLocation(temp1, index, l_latitude, l_longitude).then(dataVal => {
        var data: any = [];
        data = JSON.parse(JSON.stringify(dataVal));
        for (let obj of data) {
          if (obj.item_help_property == "BT") {
            if (obj.status == "") {
              obj.status = "Checked";
              this.uploadEntryStatus[index] = "T";
            }
          }
        }
        this.rowsOfPopulateData.splice(index, 1, data);
      }, function (err) { })
    }, err => {
      this.globalObjects.displayCordovaToast("Unable to get Location...");
    })
  }

  getLocation(temp1, index, lat, lng) {
    return new Promise((resolve, reject) => {
      var l_location = '';
      var l_latlng = new google.maps.LatLng(lat, lng);
      var l_geocoder = new google.maps.Geocoder();
      l_geocoder.geocode({ 'latLng': l_latlng }).then((results, status) => {
        if (status == google.maps.GeocoderStatus.OK) {
          if (results[1]) {
            l_location = results[1].formatted_address;
            temp1.push({ column_name: "LOCATION", entry_by_user: "F", value: l_location });
            resolve(temp1);
          }
        }
      });
    })
  }

  save(rowsOfPopulateData, uploadEntryStatus) {

    if (this.sp_Obj.type == "offlineUpdateEntry") {
      // dataServices.updateLocPopEntryToLoacalDB(rowsOfPopulateData, l_appSeqNo, sp_Obj.index,uploadEntryStatus).then(function (data) {
      //     $cordovaToast.show('Entry saved successfully', 'long', 'bottom')
      //     $ionicHistory.goBack(-1);
      // }, function (err) {
      //     $cordovaToast.show('Try Again', 'long', 'bottom')
      // })
    } else {
      var temp1: any = {};
      this.pouchDBService.getObject(this.l_appSeqNo + "_seqNo").then(dataObj => {
        temp1 = dataObj;
        temp1.entryList = rowsOfPopulateData;
        this.pouchDBService.put(this.l_appSeqNo + "_seqNo", temp1);
        this.globalObjects.displayCordovaToast("Entry saved successfully...");
      }, err => {
        temp1._id = this.l_appSeqNo + "_seqNo";
        temp1.entryList = rowsOfPopulateData;
        this.pouchDBService.put(this.l_appSeqNo + "_seqNo", temp1);
        this.globalObjects.displayCordovaToast("Entry saved successfully...");
      })
    }
  }

  uploadEntry(index, item) {
    if (this.online) {
      this.locationService.uploadLocation(item, this.url, this.l_appSeqNo, this.l_userCode, "").then(data => {
        for (let obj of item) {
          if (obj.item_help_property == "BT") {
            if (obj.status == 'Checked') {
              obj.status = "uploaded"
              this.uploadEntryStatus[index] = 'F';
            }
          }
        }
        this.rowsOfPopulateData.splice(index, 1, item);
      }, function (err) { });
    } else {
      this.globalObjects.displayCordovaToast('Network is not available Try Again...');
    }
  }

  takeImage(column_name, index) {
    this.addUpdateEntryServices.takePhoto(column_name, 'CAMERA').then((imageData) => {
      var temp1 = this.rowsOfPopulateData[index];
      if (temp1.length > 0) {
        for (let obj of temp1) {
          if (obj.column_name == column_name) {
            obj.value = imageData;
          }
        }
        this.rowsOfPopulateData.splice(index, 1, temp1);
      }
    })
  }

  autoCalculation(column_name) {
    for (let item of this.rowsOfPopulateData) {
      item = this.addUpdateEntryServices.autoCalculation(column_name, item);
    }
  }

  openLov(column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
    if (dependent_row) {
      if (dependent_row.indexOf('#') > -1) {
        dependent_row_logic = dependent_row;
        for (let obj of this.fields) {
          if (dependent_row_logic.indexOf(obj.column_name) > -1) {
            if (obj.codeOfValue) {
              dependent_row_logic = dependent_row_logic.replace(obj.column_name, obj.codeOfValue);
            } else {
              if (obj.value) {
                dependent_row_logic = dependent_row_logic.replace(obj.column_name, obj.value);
              } else {
                dependent_row_logic = dependent_row_logic.replace(obj.column_name, "null");
              }
            }
          }
        }
      } else {
        for (let obj of this.fields) {

          if (obj.column_name == dependent_row) {
            if (dependent_row_logic == "=") {
              if (obj.codeOfValue != null) {
                dependent_row_logic = obj.codeOfValue;
              } else {
                if (obj.value != null) {
                  dependent_row_logic = obj.value;
                } else {
                  dependent_row_logic = "=";
                }
              }
            }
          }
        }
      }
    }

    var paramValue: any = {};
    paramValue.column_desc = column_desc;
    paramValue.column_name = column_name;
    paramValue.dependent_row = dependent_row;
    paramValue.dependent_row_logic = dependent_row_logic;
    paramValue.item_help_property = item_help_property;
    paramValue.url = this.url;
    paramValue.user_code = this.l_userCode;
    paramValue.appSeqNo = this.l_appSeqNo;
    paramValue.fields = this.fields;

    let SingleSelectLovModal = this.modalCtrl.create('SingleSelectLovPage', { paramValue: paramValue });
    SingleSelectLovModal.onDidDismiss(fieldsData => {
      this.fields = fieldsData;
    });
    SingleSelectLovModal.present();

  }

  dependent_lov(dependent_row, value) {
    this.fields = this.addUpdateEntryServices.dependent_lov(dependent_row, value, this.fields)
  }

  textAreaPopOver(event, column_name, fields, column_desc, value) {
    let textareaEditModal = this.modalCtrl.create('TextAreaPopoverPage', { data1: value });
    textareaEditModal.onDidDismiss(textareaData => {
      this.nameOfColumn = column_name;
    })
    textareaEditModal.present();
  }


  dependent_nullable_logic(value, column_name, dependent_value, flag) {
    this.addUpdateEntryServices.dependent_nullable_logic(value, column_name, this.fields, this.url, this.l_appSeqNo, dependent_value, flag)
      .then((data) => {
        this.fields = data;
        if (flag == 'search') {
        } else {
          this.addUpdateEntryServices.setColumnDependentVal(this.fields, this.url, this.l_appSeqNo, column_name);
        }
      });
  }

}


