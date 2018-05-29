import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { NavController, ModalController, NavParams, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
// import { SignaturePadPage } from '../signature-pad/signature-pad';
import { DataServicesProvider } from '../../providers/data-services/data-services';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';
// import { EntryListPage } from '../entry-list/entry-list';
// import { TextAreaPopoverPage } from '../text-area-popover/text-area-popover'
// import { HomePage } from '../home/home';
// import { AddUpdateOrderPage } from '../add-update-order/add-update-order'
// import { PopulatedOrderEntryFormPage } from '../populated-order-entry/populated-order-entry';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
import { DatePicker } from '@ionic-native/date-picker';
import { Pipe } from '@angular/core';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';
// import { GridDetailsModalPage } from '../grid-details-modal/grid-details-modal';
import { Device } from '@ionic-native/device';
// import { EntryDetailsInTabularPage } from '../entry-details-in-tabular/entry-details-in-tabular';
// import { ImageEntryPage } from '../image-entry/image-entry';
import { DomSanitizer } from '@angular/platform-browser';
@Pipe({ name: 'safe' })

@IonicPage()
@Component({
  selector: 'page-add-update-entry',
  templateUrl: 'add-update-entry.html',
})
export class AddUpdateEntryPage {

  @Input() numStars: number = 5;
  @Input() value: number = 0;
  @Output() ionClick: EventEmitter<number> = new EventEmitter<number>();
  @ViewChild('myvideo') myVideo: any;
  videoURL: any;

  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  orderFormNext: string
  user_code: string
  url: string;
  flagForEntryListButton: boolean;
  online: boolean;
  l_videoBase64: any;
  fields: any = [];
  userDetails: any = {};
  l_object: any = {};
  stars: string[] = [];
  option: BarcodeScannerOptions;
  recordedVideoData: any;
  isReadonly: boolean = true;
  constructor(
    public navCtrl: NavController, public httpClient: HttpClient, public popOverCtrl: PopoverController,
    public navParams: NavParams, public modalCtrl: ModalController, public barcode: BarcodeScanner, private datePicker: DatePicker,
    private globalObjects: GlobalObjectsProvider, private dataServices: DataServicesProvider,
    private addUpdateEntryServices: AddUpdateEntryServicesProvider, public pouchDBService: PouchDBService,
    public _DomSanitizer: DomSanitizer, private device: Device) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
    this.online = this.globalObjects.getOnlineStatus();
  }

  ionViewDidLoad() {
    var l_url = "";
    if (this.sp_obj.type == "Update") {
      this.orderFormNext = "Update";
      if (this.sp_obj.types == 'O') {
        this.l_appSeqNo = (this.l_appSeqNo + 0.1);
        l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&entrySeqId=' + this.sp_obj.seqId + '&userCode=' +
          this.user_code;
        if (this.sp_obj.types == 'Q') {
          this.l_appSeqNo = (this.l_appSeqNo + 0.1);
        }
        if (this.sp_obj.dependent_next_entry_update_key_codeOfValue) {
          l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_codeOfValue;
        } else {
          l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_value;
        }
      } else {
        if (this.sp_obj.types == "I") {
          this.l_appSeqNo = this.sp_obj.dependent_next_entry_seq

          l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&userCode=' +
            this.user_code

          if (this.sp_obj.dependent_next_entry_update_key_codeOfValue) {
            l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_codeOfValue;
          } else {
            l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_value;
          }

        } else {
          l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&entrySeqId=' + this.sp_obj.seqId + '&userCode=' +
            this.user_code;
          if (this.sp_obj.update_key_codeOfValue) {
            l_url = l_url + "&updateKey=" + this.sp_obj.update_key_codeOfValue;
          } else {
            l_url = l_url + "&updateKey=" + this.sp_obj.update_key_value;
          }
        }
      }

    } else {
      if ((this.sp_obj.updation_process).indexOf("V") > -1) {
        this.flagForEntryListButton = true;
      }
      if (this.sp_obj.type == "order" || this.sp_obj.type == "orderPopulated" || this.sp_obj.firstScreen == "EG") {
        this.orderFormNext = "next";
        this.l_appSeqNo = (parseInt(this.l_appSeqNo) + 0.1).toString();
        l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.user_code;
      } else {
        if (this.sp_obj.dependent_next_entry_seq) {
          this.l_appSeqNo = this.sp_obj.dependent_next_entry_seq;
          l_url = this.url + 'addEntryForm?seqNo=' + this.sp_obj.dependent_next_entry_seq + '&userCode=' + this.user_code;
        } else {
          l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.user_code;
        }
      }
      l_url = l_url + "&accCode=" + this.userDetails.acc_code + '&searchText=';
    }

    if (this.sp_obj.type == "offlineUpdateEntry") {
      if (this.sp_obj.headEntry != undefined) {
        this.fields = this.sp_obj.headEntry;
      } else {
        this.fields = this.sp_obj.recordsInfo;
      }
      this.setData();
    } else if (this.online) {
      this.httpClient.get(l_url)
        .subscribe(data => {
          var tempdata: any = {};
          tempdata = data;
          this.fields = tempdata.recordsInfo;
          if (this.fields) {
            this.addUpdateEntryServices.setDataCommon(this.fields, this.sp_obj.vrno, "", this.userDetails.acc_code, this.userDetails.div_code, this.userDetails.entity_code)
              .then(fields => {
                this.fields = fields;
                this.setData();
              });
          } else {
            this.globalObjects.displayCordovaToast("Data Not Available");
          }

        }, err => {
        })
    } else {
      var id = this.l_appSeqNo.toString();
      id = id + "_seqNo";
      this.pouchDBService.getObject(id).then(dta => {
        var data: any = dta;
        this.fields = data.recordsInfo;
        this.addUpdateEntryServices.setDataCommon(this.fields, this.sp_obj.vrno, "", this.userDetails.acc_code, this.userDetails.div_code, this.userDetails.entity_code).then(fields => {
          this.fields = fields;
          for (let obj of this.fields) {
            if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
              obj.value = this.globalObjects.formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss');
            }
          }
          this.setData();
        });
      }, err => {
        let alertVal = this.globalObjects.showAlert("Data is not available please REFRESH app");
        alertVal.present();
      })
    }
  }
  entryList() {
    var l_obje: any = [];
    l_obje.seqNo = this.l_appSeqNo;
    var dates = new Date();
    var Inputdate = this.globalObjects.formatDate(dates, "dd-MM-yyyy");;
    l_obje.date2 = Inputdate;
    l_obje.table_desc = this.table_desc;
    l_obje.firstScreen = this.sp_obj.firstScreen;
    l_obje.updation_process = this.sp_obj.updation_process;
    if (this.sp_obj.type == "order") {
      l_obje.types = this.sp_obj.types;
    }
    this.navCtrl.push('EntryListPage', { sp_obj: l_obje });
  }
  setData() {
    var imgCount = 1;
    var remarkCount = 1
    for (let obj1 of this.fields) {
      if (obj1.column_name == 'APP_IMENO' || obj1.column_default_value == "APP_IMENO") {
        obj1.value = this.device.model + '~~' + this.device.uuid;
      }
      if (obj1.column_default_value == 'APP_GPS') {
        obj1.value = this.l_object.l_latitude + '~~' + this.l_object.l_longitude;
      }
      if (this.sp_obj.sessionE) {
        for (let data of this.sp_obj.sessionE) {
          if (data.column_name == obj1.column_name) {
            obj1.value = data.value;
            obj1.codeOfValue = data.codeOfValue;
          }
        }
      }

      if (this.sp_obj.type == 'H' && this.sp_obj.imgs) {
        if (obj1.item_help_property == "I") {
          for (let img of this.sp_obj.imgs) {
            if (img.doc_slno == imgCount) {
              obj1.value = img.doc_img;
            }
          }
          imgCount++
        }
        if (obj1.item_help_property == "A") {
          for (let img of this.sp_obj.imgs) {
            if (img.doc_slno == remarkCount) {
              obj1.value = img.doc_desc;
            }
          }
          remarkCount++
        }
      }
    }
    if (this.sp_obj.type == "Update" || this.sp_obj.types == "I") {
      for (let obj1 of this.fields) {
        if ((obj1.updation_process).indexOf("U") > -1) { } else {
          obj1.entry_by_user = "R";
        }
        if (obj1.column_name == this.sp_obj.update_key) {
          if (!obj1.value && !obj1.codeOfValue) {
            obj1.value = this.sp_obj.update_key_value;
            obj1.codeOfValue = this.sp_obj.update_key_codeOfValue;
          }
        }
        for (let obj2 of this.fields) {
          if (obj1.column_name == obj2.dependent_row) {
            if (obj1.codeOfValue) {
              obj2.dependent_row_logic = obj1.codeOfValue;
            } else {
              obj2.dependent_row_logic = obj1.value;
            }
          }
        }
        if (obj1.item_help_property == "R") {
          this.setRating(obj1.value, obj1.column_name);
        }
      }
    } else {
      if (this.sp_obj.type == "offlineUpdateEntry") {
        for (let obj1 of this.fields) {
          for (let obj2 of this.fields) {
            if (obj1.column_name == obj2.dependent_row) {
              obj2.dependent_row_logic = obj1.codeOfValue;
            }
          }
          if (obj1.column_type == "VIDEO") {
            obj1.item_help_property = "V";
            if (obj1.value) {
              obj1.value = 'data:video/mp4;base64,' + obj1.value;
            }

          }
          if ((obj1.updation_process).indexOf("U") > -1) {
            if (obj1.column_desc == "User Code") { } else {
              obj1.entry_by_user = "T";
            }
          } else {
            obj1.entry_by_user = "R";
          }
        }
      } else {
        for (let obj1 of this.fields) {
          if ((obj1.updation_process).indexOf("I") > -1) { } else {
            obj1.entry_by_user = "F";
            obj1.nullable = "T";
          }
          if ((obj1.column_default_value) == "LHSSYS_CALENDER_SCHEDULER") {
            var value = (obj1.value).split('#');
            obj1.value = value[0];
            obj1.codeOfValue = value[1];
          }
          if (obj1.dependent_column_name) {
            if (obj1.query_dependent_row) {
              var qdr = obj1.query_dependent_row.split('#');
              var qdr_value = qdr;
              for (let obj of this.fields) {
                if (qdr.indexOf(obj.column_name) > -1) {
                  qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
                }
              }
              value = qdr_value.join('~');
            }
            this.addUpdateEntryServices.setselfDependantRowValue(this.url, obj1.column_name, this.l_appSeqNo, value, this.fields).then((data) => {
              this.globalObjects.hideLoading();
              if (data) {
                var listDependentValue: any = data;
                for (let obj1 of listDependentValue) {
                  for (let obj of this.fields) {
                    if (obj1.columnName == obj.column_name) {
                      obj.value = obj1.value;
                    }
                  }
                }
              }
              this.addUpdateEntryServices.setColumnDependentVal(this.fields, this.url, this.l_appSeqNo, obj1.column_name);
            });
          }


          this.addUpdateEntryServices.setDependantRowValue(obj1.column_name, obj1.codeOfValue, this.l_appSeqNo, obj1.dependent_row, "type", this.fields, this.url, this.table_desc).then(data => {
            this.fields = data
          });
        }
      }
    }
    if (this.sp_obj.type == "IM") {
      this.orderFormNext = "image";
    }
  }

  addEntry(fieldsData) {
    var checkForSessionEntry = false;
    var key = "valueToSend";
    var session = {
      sessionvalue: []
    };
    var sessionHB = [];
    for (let obj of fieldsData) {
      if (obj.session_column_flag) {
        if (obj.session_column_flag.indexOf('T') > -1) {
          checkForSessionEntry = true;
          var item = obj;
          session.sessionvalue.push({
            "column_name": item.column_name,
            "value": item.value,
            "codeOfValue": item.codeOfValue
          });
        }
        if (obj.session_column_flag.indexOf('HB') > -1) {
          sessionHB.push({
            "column_name": obj.column_name,
            "value": obj.value,
            "codeOfValue": obj.codeOfValue
          });
        }
      }
      if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
        obj[key] = this.user_code;
      } else {
        if (obj.item_help_property == "MD") {
          if (obj.value || obj.value == "") {
            for (let data of obj.value) {
              if (obj[key]) {
                obj[key] = obj[key] + ',' + data;
              } else {
                obj[key] = data;
              }
            }
          } else {
            obj[key] = "1";
          }
        } else {
          if (obj.temp != null) {
            obj[key] = (obj.temp + "#" + obj.value);
          } else {
            if (obj.column_type == "DATETIME") {
              obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy HH:mm:ss');
            } else {
              if (obj.column_name == "CASE_NO") {
                if (obj.codeOfValue) {
                  this.sp_obj.CASE_NO = obj.codeOfValue;
                  obj[key] = obj.codeOfValue;
                } else {
                  this.sp_obj.CASE_NO = obj.value;
                  obj[key] = obj.value;
                }
              } else {
                if (obj.column_type == "DATE") {
                  obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy');

                } else {
                  if (obj.codeOfValue != null) {
                    obj[key] = obj.codeOfValue;
                  } else {
                    obj[key] = obj.value;
                  }
                }
              }

            }
          }
        }
      }
      if (obj.column_name == this.sp_obj.update_key) {
        if (obj.codeOfValue) {
          this.sp_obj.updateKey_value = obj.value;
          this.sp_obj.updateKey_codeOfValue = obj.codeOfValue;
        } else {
          this.sp_obj.updateKey_value = obj.value;
          this.sp_obj.updateKey_codeOfValue = obj.value;
        }
      }
      if (!this.online) {
        if (obj.column_type == "DATETIME" || obj.column_type == "DATE") {
          if (this.l_object.l_dateTime) {
            obj[key] = this.l_object.l_dateTime;
            obj.value = this.l_object.l_dateTime;
          }
        }
      }
    }
    this.sp_obj.sessionHB = sessionHB;
    if (checkForSessionEntry) {
      this.dataServices.storeSessionColumn1(session.sessionvalue).then((data) => {
        if (this.sp_obj.mandatory_to_start_portal === 'F') {
          this.globalObjects.displayCordovaToast('Entry saved successfully.');
          this.navCtrl.pop();
        }
      })
    }

    if (this.sp_obj.mandatory_to_start_portal !== 'F') {
      if ("T" == this.sp_obj.data_UPLOAD) {
        fieldsData.push({
          column_name: "LATITUDE",
          entry_by_user: "F",
          value: this.l_object.l_dateTime,
          valueToSend: this.l_object.l_latitude
        });
        fieldsData.push({
          column_name: "LONGITUDE",
          entry_by_user: "F",
          value: this.l_object.l_longitude,
          valueToSend: this.l_object.l_longitude
        });
        fieldsData.push({
          column_name: "LOCATION",
          entry_by_user: "F",
          value: this.l_object.l_location,
          valueToSend: this.l_object.l_location
        });
      }

      if (this.online) {
        if (this.sp_obj.type == "offlineUpdateEntry") {
          if (this.sp_obj.flagFororder = 1) {
            var tempAppSeqNo2 = this.sp_obj.seqNo;
            var entryType1 = "headEntry";
            this.globalObjects.hideLoading();
            this.dataServices.updateOrderEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_obj.index,
              tempAppSeqNo2, entryType1).then(data => {
                this.sp_obj.entryIndex = data;
                this.sp_obj.tempAppSeqNo = tempAppSeqNo2;
                this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
              }, (err) => {
                this.globalObjects.displayCordovaToast('Try Again...')
              })
          } else {
            this.dataServices.updateEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_obj.index).then((data) => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
              this.navCtrl.setRoot('HomePage');
            }, (err) => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Try Again...')
            })
          }
        } else {
          if (this.sp_obj.type == "IM") {
            this.globalObjects.hideLoading();
            this.sp_obj.headEntryFieldsData = fieldsData;
            this.navCtrl.push('ImageEntryPage', { sp_obj: this.sp_obj });
          }
          else {
            if (this.sp_obj.type == "order" || this.sp_obj.type == "orderPopulated") {
              if (this.sp_obj.access_contrl == 'PO') {

                this.sp_obj.l_appSeqNo = this.l_appSeqNo;
                this.sp_obj.sessionvalue = session.sessionvalue;
                // for (let obj of fieldsData) {
                //   if (obj.session_column_flag == 'P') {
                //     this.sp_obj.searchText = obj.codeOfValue;
                //     this.sp_obj.searchTextColumnName = obj.column_name;
                //   }
                // }
                // this.navCtrl.push(PopulatedOrderEntryFormPage, { obj: this.sp_obj });

                this.sp_obj.searchText = "";

                for (let obj of fieldsData) {
                  if (obj.session_column_flag) {
                    if (obj.session_column_flag.indexOf('P') > -1) {
                      if (this.sp_obj.searchText) {
                        if (obj.codeOfValue) {
                          this.sp_obj.searchText = this.sp_obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                        } else {
                          this.sp_obj.searchText = this.sp_obj.searchText + "#" + obj.value.split('#').join('~~');
                        }
                      } else {
                        if (obj.codeOfValue) {
                          this.sp_obj.searchText = obj.codeOfValue.split('#').join('~~');
                        } else {
                          this.sp_obj.searchText = obj.value.split('#').join('~~');
                        }
                      }
                      if (this.sp_obj.searchTextColumnName) {
                        this.sp_obj.searchTextColumnName = this.sp_obj.searchTextColumnName + "#" + obj.column_name;
                      } else {
                        this.sp_obj.searchTextColumnName = obj.column_name;
                      }
                    }
                  }
                }


                if (this.sp_obj.mandatory_to_start_portal === 'E') {

                  this.dataServices.uploadEntry(fieldsData, this.l_appSeqNo, this.url, this.l_object.l_latitude,
                    this.l_object.l_longitude, this.l_object.l_location, this.sp_obj.type,
                    this.sp_obj.seqId, this.sp_obj.dependent_next_entry_seq, this.sp_obj.update_key, this.sp_obj.update_key_value,
                    this.sp_obj.update_key_codeOfValue, "").then((res) => {
                      var data: any = res;
                      this.globalObjects.hideLoading();
                      if (data.status == "insert data") {
                        this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                        this.sp_obj.VRNO = data.vrno;
                        this.addUpdateEntryServices.setSlno(1);
                        this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
                      } else {
                        this.globalObjects.displayCordovaToast(data.status);
                      }
                    }, (err) => {
                      this.globalObjects.hideLoading();
                      this.globalObjects.displayErrorMessage(err)
                    })

                } else {
                  if (this.sp_obj.mandatory_to_start_portal === 'O') {
                    var headOrderEntry: any = {};
                    headOrderEntry.fieldsData = fieldsData;
                    headOrderEntry.l_appSeqNo = this.l_appSeqNo;
                    headOrderEntry.url = this.url;

                    headOrderEntry.l_latitude = this.l_object.l_latitude;
                    headOrderEntry.l_longitude = this.l_object.l_longitude;
                    headOrderEntry.l_location = this.l_object.l_location;
                    headOrderEntry.type = this.sp_obj.type;
                    headOrderEntry.seqId = this.sp_obj.seqId;
                    headOrderEntry.dependent_next_entry_seq = this.sp_obj.dependent_next_entry_seq;
                    headOrderEntry.update_key = this.sp_obj.update_key;
                    headOrderEntry.update_key_value = this.sp_obj.update_key_value;
                    headOrderEntry.update_key_codeOfValue = this.sp_obj.update_key_codeOfValue;
                    headOrderEntry.l_base64VideoData = this.sp_obj.l_base64VideoData;
                    this.sp_obj.headOrderEntry = headOrderEntry;
                    this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                    this.addUpdateEntryServices.setSlno(1);
                    this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
                  } else {
                    this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
                  }
                }
                // this.sp_obj.l_appSeqNo = this.l_appSeqNo;
                // this.sp_obj.sessionvalue = session.sessionvalue;
                // for (let obj of fieldsData) {
                //   if (obj.session_column_flag == 'P') {
                //     this.sp_obj.searchText = obj.codeOfValue;
                //     this.sp_obj.searchTextColumnName = obj.column_name;
                //   }
                // }
                // this.navCtrl.push(PopulatedOrderEntryFormPage, { obj: this.sp_obj });
              } else {
                if (this.sp_obj.mandatory_to_start_portal === 'O') {
                  let headOrderEntry: any = {};
                  headOrderEntry.fieldsData = fieldsData;
                  headOrderEntry.l_appSeqNo = this.l_appSeqNo;
                  headOrderEntry.url = this.url;
                  headOrderEntry.l_latitude = this.l_object.l_latitude;
                  headOrderEntry.l_longitude = this.l_object.l_longitude;
                  headOrderEntry.l_location = this.l_object.l_location;
                  headOrderEntry.type = this.sp_obj.type;
                  headOrderEntry.seqId = this.sp_obj.seqId;
                  headOrderEntry.dependent_next_entry_seq = this.sp_obj.dependent_next_entry_seq;
                  headOrderEntry.update_key = this.sp_obj.update_key;
                  headOrderEntry.update_key_value = this.sp_obj.update_key_value;
                  headOrderEntry.update_key_codeOfValue = this.sp_obj.update_key_codeOfValue;
                  headOrderEntry.l_base64VideoData = this.sp_obj.l_base64VideoData;

                  this.sp_obj.headOrderEntry = headOrderEntry;
                  this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                  this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj });
                } else {
                  this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj });
                }
              }
              this.globalObjects.hideLoading();
            } else {
              if (this.sp_obj.type == "EG") {
                this.sp_obj.searchText = "";
                for (let obj of fieldsData) {
                  if (obj.session_column_flag) {
                    if (obj.session_column_flag.indexOf('P') > -1) {
                      if (this.sp_obj.searchText) {
                        if (obj.codeOfValue) {
                          this.sp_obj.searchText = this.sp_obj.searchText + "#" + obj.codeOfValue.split('#').join('~~');
                        } else {
                          this.sp_obj.searchText = this.sp_obj.searchText + "#" + obj.value.split('#').join('~~');
                        }
                      } else {
                        if (obj.codeOfValue) {
                          this.sp_obj.searchText = obj.codeOfValue.split('#').join('~~');
                        } else {
                          this.sp_obj.searchText = obj.value.split('#').join('~~');
                        }
                      }
                      if (this.sp_obj.searchTextColumnName) {
                        this.sp_obj.searchTextColumnName = this.sp_obj.searchTextColumnName + "#" + obj.column_name;
                      } else {
                        this.sp_obj.searchTextColumnName = obj.column_name;
                      }
                    }
                  }
                }
                if (this.sp_obj.mandatory_to_start_portal === 'E') {

                  this.dataServices.uploadEntry(fieldsData, this.l_appSeqNo, this.url, this.l_object.l_latitude,
                    this.l_object.l_longitude, this.l_object.l_location, this.sp_obj.type,
                    this.sp_obj.seqId, this.sp_obj.dependent_next_entry_seq, this.sp_obj.update_key, this.sp_obj.update_key_value, this.sp_obj.update_key_codeOfValue, "l_base64VideoData").then((resultData) => {
                      this.globalObjects.hideLoading();
                      var data: any = resultData;
                      if (data.status == "insert data") {
                        this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                        this.sp_obj.VRNO = data.vrno;
                        this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj })
                      } else {
                        this.globalObjects.displayCordovaToast(data.status);
                      }
                    }, (err) => {
                      this.globalObjects.hideLoading();
                      this.globalObjects.displayErrorMessage(err)
                    })
                } else {
                  if (this.sp_obj.mandatory_to_start_portal === 'O') {
                    let headOrderEntry: any = {};
                    headOrderEntry.fieldsData = fieldsData;
                    headOrderEntry.l_appSeqNo = this.l_appSeqNo;
                    headOrderEntry.url = this.url;
                    headOrderEntry.l_latitude = this.l_object.l_latitude;
                    headOrderEntry.l_longitude = this.l_object.l_longitude;
                    headOrderEntry.l_location = this.l_object.l_location;
                    headOrderEntry.type = this.sp_obj.type;
                    headOrderEntry.seqId = this.sp_obj.seqId;
                    headOrderEntry.dependent_next_entry_seq = this.sp_obj.dependent_next_entry_seq;
                    headOrderEntry.update_key = this.sp_obj.update_key;
                    headOrderEntry.update_key_value = this.sp_obj.update_key_value;
                    headOrderEntry.update_key_codeOfValue = this.sp_obj.update_key_codeOfValue;
                    headOrderEntry.l_base64VideoData = this.sp_obj.l_base64VideoData;
                    this.sp_obj.headOrderEntry = headOrderEntry;
                    this.globalObjects.hideLoading();
                    this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                    this.addUpdateEntryServices.setSlno(1);
                    this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj })
                  } else {
                    this.globalObjects.hideLoading();
                    this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj })
                  }
                }
              } else {
                this.dataServices.uploadEntry(fieldsData, this.l_appSeqNo, this.url, this.l_object.l_latitude,
                  this.l_object.l_longitude, this.l_object.l_location, this.sp_obj.type,
                  this.sp_obj.seqId, this.sp_obj.dependent_next_entry_seq, this.sp_obj.update_key,
                  this.sp_obj.update_key_value, this.sp_obj.update_key_codeOfValue, "l_base64VideoData")
                  .then((resultData) => {
                    this.globalObjects.hideLoading();
                    var data: any = resultData;
                    if (data.status == "insert data") {
                      if (data.vrno) {
                        let alertVal = this.globalObjects.showAlert(data.vrno);
                        alertVal.present();
                      }
                      this.globalObjects.displayCordovaToast('Entry Saved Successfully.')
                      if (this.sp_obj.duplicate_row_value_allow === 'R') {
                        this.navCtrl.setRoot(this.navCtrl.getActive().component);
                      } else {
                        this.navCtrl.setRoot('HomePage');
                      }
                    } else
                      if (data.status == "updated data") {
                        if (this.sp_obj.types == "O") {
                          var l_obj: any = [];
                          l_obj.listData = fieldsData;
                          l_obj.seqNo = ((parseInt(this.sp_obj.SeqNo)) + 0.2);
                          this.navCtrl.push('EntryDetailsInTabularPage', { obj: l_obj })
                        } else {
                          this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
                          if (this.sp_obj.types == 'Q' || this.sp_obj.type == 'H') {
                            this.navCtrl.setRoot('HomePage');
                          } else if (this.sp_obj.type == 'Update') {
                            this.entryList()
                          } else {
                            this.navCtrl.setRoot('HomePage');
                          }
                        }
                      } else {
                        this.globalObjects.displayCordovaToast(data.status);
                      }

                  }, (err) => {
                    this.globalObjects.hideLoading();
                    this.globalObjects.displayErrorMessage(err)
                  })
              }
            }
          }
        }
      } else {

        if (this.sp_obj.type == "offlineUpdateEntry") {
          if (this.sp_obj.flagFororder == 1) {
            var tempAppSeqNo = this.sp_obj.seqNo;
            var entryType = "headEntry";
            this.dataServices.updateOrderEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_obj.index,
              tempAppSeqNo, entryType).then((data) => {
                this.globalObjects.hideLoading();
                this.sp_obj.entryIndex = data;
                this.sp_obj.tempAppSeqNo = tempAppSeqNo;
                this.sp_obj.table_desc = this.sp_obj.table_desc;
                this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
              }, err => {
                this.globalObjects.hideLoading();
                this.globalObjects.displayCordovaToast('Try Again...')
              })
          } else {
            this.dataServices.updateEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_obj.index).then((data) => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
              this.navCtrl.setRoot('HomePage');
            }, err => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Try Again...')
            })
          }
        } else {
          if (this.sp_obj.type == "order") {
            var tempAppSeqNo3 = this.sp_obj.seqNo;
            this.sp_obj.tempAppSeqNo = tempAppSeqNo3;
            var entryType2 = "headEntry";
            this.globalObjects.hideLoading();
            this.dataServices.addOrderEntryToLoacalDB(fieldsData, tempAppSeqNo3, entryType2, "",
              this.l_object.l_dateTime).then((data) => {
                this.sp_obj.entryIndex = data;
                this.navCtrl.push('AddUpdateOrderPage', { sp_obj: this.sp_obj });
              }, err => {
                this.globalObjects.hideLoading();
                this.globalObjects.displayCordovaToast('Try Again...')
              })
          } else if (this.sp_obj.access_contrl == 'PO' || this.sp_obj.type == "orderPopulated") {
            this.sp_obj.l_appSeqNo = this.l_appSeqNo;
            this.sp_obj.sessionvalue = session.sessionvalue;
            for (let obj of fieldsData) {
              if (obj.session_column_flag == 'P') {
                this.sp_obj.searchText = obj.codeOfValue;
                this.sp_obj.searchTextColumnName = obj.column_name;
              }
            }
            this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: this.sp_obj });
          } else {
            this.dataServices.addEntryToLoacalDB(fieldsData, this.l_appSeqNo, "", "", "", "").then((data) => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Entry saved successfully.')
              this.globalObjects.goBack(-1);
              this.globalObjects.hideLoading();
            }, (err) => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Try Again...')
            })
          }
        }
      }
    }
  }
  cancelEntry() {
    let alertVal = this.globalObjects.confirmationPopup('Do you want to Cancel Entry?');
    alertVal.present();
    alertVal.onDidDismiss((data) => {
      if (data == true) {
        this.navCtrl.pop();
        if (this.sp_obj.firstScreen == "PO" || this.sp_obj.access_contrl == 'PO') {
          var seqNoData: any;
          seqNoData = parseFloat(this.sp_obj.seqNo) + parseFloat("0.2");
          var id = "entrySeqNo" + seqNoData;
          this.globalObjects.destroyLocalData(id);
        }
      }
    });
  }
  setLOVValues(item) {
    for (let obj of this.fields) {
      if (obj.column_name == item.column_name) {
        obj.value = "";
        obj.codeOfValue = "";
      }
      if (obj.dependent_row) {
        if (obj.dependent_row.indexOf(item.column_name) > -1) {
          if (obj.item_help_property == 'L') {
            obj.dependent_row_logic = item.name;
            obj.value = "";
            obj.codeOfValue = "";
          } else {
            if (obj.item_help_property == 'AS') {
            } else {
              obj.value = "";
              obj.codeOfValue = "";
            }
          }
        }
      }
    }
  }

  showGridDetails(item) {
    let GridDetailsModal = this.modalCtrl.create('GridDetailsModalPage', { paramValue: item, fields: this.fields, l_appSeqNo: this.l_appSeqNo });
    GridDetailsModal.onDidDismiss(fieldsData => {
    });
    GridDetailsModal.present();
  }
  ngAfterViewInit() {
    this.calc();
  }
  calc() {
    this.stars = [];
    let tmp = this.value;
    for (let i = 0; i < this.numStars; i++ , tmp--) {
      if (tmp >= 1)
        this.stars.push("star");
      else
        this.stars.push("star-outline");
    }
  }

  setRating(value, column_name) {
    this.value = value;
    for (let obj of this.fields) {
      if (obj.column_name === column_name) {
        obj.value = this.value;
      }
    }
    this.calc();
  }


  searchByText(column_name, value, dependent_column_name, query_dependent_row) {
    this.globalObjects.showLoading();
    if (dependent_column_name) {

      if (query_dependent_row) {
        var qdr = query_dependent_row.split('#');
        var qdr_value = qdr;
        for (let obj of this.fields) {
          if (qdr.indexOf(obj.column_name) > -1) {
            qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
          }
        }
        value = qdr_value.join('~');
      }
      this.addUpdateEntryServices.setselfDependantRowValue(this.url, column_name, this.l_appSeqNo, value, this.fields).then((data) => {
        this.globalObjects.hideLoading();
        if (data) {
          var listDependentValue: any = data;
          for (let obj1 of listDependentValue) {
            for (let obj of this.fields) {
              if (obj1.columnName == obj.column_name) {
                obj.value = obj1.value;
              }
            }
          }
        }
        this.addUpdateEntryServices.setColumnDependentVal(this.fields, this.url, this.l_appSeqNo, column_name);
      });
    } else {
      this.globalObjects.hideLoading();
      this.addUpdateEntryServices.setDependantRowValue(column_name, name, this.l_appSeqNo, column_name, "type", this.fields, this.url, this.table_desc).then(fields => {
        this.fields = fields;
      }, err => { });
      this.addUpdateEntryServices.setColumnDependentVal(this.fields, this.url, this.l_appSeqNo, column_name);
    }

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

  dependent_lov(dependent_row, value) {
    this.fields = this.addUpdateEntryServices.dependent_lov(dependent_row, value, this.fields)
  }


  openLov(column_desc, column_name, dependent_row, dependent_row_logic, item_help_property, value) {
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
    paramValue.user_code = this.user_code;
    paramValue.appSeqNo = this.l_appSeqNo;
    paramValue.fields = this.fields;
    paramValue.value = value
    let SingleSelectLovModal = this.modalCtrl.create('SingleSelectLovPage', { paramValue: paramValue });
    SingleSelectLovModal.onDidDismiss(fieldsData => {
      this.dependent_nullable_logic(name, column_name, this.fields, this.url)
    });
    SingleSelectLovModal.present();

  }

  scanBarcode(column_name) {
    this.addUpdateEntryServices.scanBarcode(this.fields, column_name, this.url, this.l_appSeqNo, '', this.sp_obj.table_desc).then((dataVal) => {
      this.fields = dataVal;
      for (let data of this.fields) {
        if (column_name == data.column_name) {
          this.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
        }
      }
    })
  }

  takeImage(column_name, flag) {
    this.addUpdateEntryServices.takePhoto(column_name, flag).then((imageData) => {
      for (let obj of this.fields) {
        if (obj.column_name == column_name) {
          obj.value = imageData;
          obj.textOverLay = "T";
        }
      }
    })
  }

  showDatepicker(column_name) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    }).then(
      date => {
        for (let items of this.fields) {
          if (column_name == items.column_name) {
            var dateVal = "";
            dateVal = this.globalObjects.formatDate(date, 'dd-MM-yyyy HH:mm:ss');
            items.value = dateVal;
          }
        }
      },
      err => console.log('Error occurred while getting date: ', err)
    );
  }

  takeVideo(column_name, column_size) {
    this.addUpdateEntryServices.takeVideo(column_name, column_size, this.fields).then((data) => {
    })
  }


  textAreaPopOver(event, column_name, fields, column_desc, value) {
    let textareaEditModal = this.popOverCtrl.create('TextAreaPopoverPage', { data1: value, heading: column_desc });
    textareaEditModal.onDidDismiss(textareaData => {
      for (let obj of this.fields) {
        if (obj.column_name == column_name) {
          obj.value = textareaData;
        }
      }
    })
    textareaEditModal.present();
  }

  autoCalculation(column_name) {
    this.fields = this.addUpdateEntryServices.autoCalculation(column_name, this.fields);
  }

  autoCalculationOfDuration(column_name) {
    this.fields = this.addUpdateEntryServices.autoCalculationOfDuration(this.fields, column_name);
  }

  opensignaturePad(column_name) {
    let signPadModal = this.modalCtrl.create('SignaturePadPage', {});
    signPadModal.onDidDismiss(imageData => {
      for (let data of this.fields) {
        if (data.column_name === column_name) {
          if (imageData) {
            data.value = imageData.replace("data:image/png;base64,", "");
          }
          data.textOverLay = "T";
        }
      }
    });
    signPadModal.present();
  }

  saveLocation() {
    this.addUpdateEntryServices.getLatLongTimestamp().then(object => {
      var data: any = object
      for (let obj of this.fields) {
        if (obj.column_name == "LOCATION") {
          obj.value = data.location;
        }
        if (obj.column_name == "LONGITUDE") {
          obj.value = data.longitude;
        }
        if (obj.column_name == "LATITUDE") {
          obj.value = data.latitude;
        }
      }
    }, err => {
      // console.log(err);
    })
  }
}
