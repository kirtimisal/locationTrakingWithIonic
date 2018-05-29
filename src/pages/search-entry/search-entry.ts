import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
import { BarcodeScanner, BarcodeScannerOptions } from '@ionic-native/barcode-scanner';
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';
import { DataServicesProvider } from '../../providers/data-services/data-services';
// import { HomePage } from '../home/home';
// import { AddUpdateOrderPage } from '../add-update-order/add-update-order';

@IonicPage()
@Component({
  selector: 'page-search-entry',
  templateUrl: 'search-entry.html',
})
export class SearchEntryPage {
  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  orderFormNext: string
  user_code: string;
  update_key;
  url: string;
  flagForEntryListButton: boolean;
  online: boolean = true;
  fields: any = [];
  userDetails: any = {};
  l_object: any = {};
  stars: string[] = [];
  option: BarcodeScannerOptions;
  recordedVideoData: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public barcode: BarcodeScanner, public dataServices: DataServicesProvider,
    public modalCtrl: ModalController, 
    public globalObjects: GlobalObjectsProvider, public httpClient: HttpClient, private addUpdateEntryServices: AddUpdateEntryServicesProvider) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
    this.update_key = this.sp_obj.update_key;
    this.l_object = this.addUpdateEntryServices.getLatLongTimestamp();
  }

  ionViewDidLoad() {
    var l_url = "";
      if (this.sp_obj.type == "Update") {
      this.orderFormNext = "Update";
      if (this.sp_obj.types == 'O') {
        this.l_appSeqNo = (this.l_appSeqNo + 0.1);
        l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&entrySeqId=' + this.sp_obj.seqId + '&userCode=' + this.user_code;
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
          l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&userCode=' + this.user_code
          if (this.sp_obj.dependent_next_entry_update_key_codeOfValue) {
            l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_codeOfValue;
          } else {
            l_url = l_url + "&updateKey=" + this.sp_obj.dependent_next_entry_update_key_value;
          }
        } else {
          l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&entrySeqId=' + this.sp_obj.seqId + '&userCode=' + this.user_code;
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
    } else if (this.online) {
      this.httpClient.get(l_url).subscribe(data => {
          var tempdata: any = {};
          tempdata = data;
          this.fields = tempdata.recordsInfo;
          this.addUpdateEntryServices.setDataCommon(this.fields, this.sp_obj.vrno, "", this.userDetails.acc_code, this.userDetails.div_code, this.userDetails.entity_code)
            .then(fields => { this.fields = fields;  });
        }, err => { })
    } else {
      var id = this.l_appSeqNo.toString();
      id = id + "";
    }

  }

  autoCalculation(column_name) {
    this.fields = this.addUpdateEntryServices.autoCalculation(column_name, this.fields);
  }

  updateEntry(fieldsData) {
    for (let data of fieldsData) {
      if (data.update_key == data.column_name) {
        this.sp_obj.dependent_next_entry_update_key = data.update_key;
        this.sp_obj.dependent_next_entry_update_key_value = data.value
        this.sp_obj.dependent_next_entry_update_key_codeOfValue = data.codeOfvalue;
      }
    }
    this.sp_obj.type = "Update";
    this.sp_obj.types = "I";
    this.sp_obj.dependent_next_entry_seq = this.sp_obj.replicate_fields;
    this.globalObjects.setDataLocally('tabParam', this.sp_obj);
  }

  dependent_nullable_logic(value, column_name, dependent_value, flag) {
    this.addUpdateEntryServices.dependent_nullable_logic(value, column_name, this.fields, this.globalObjects.getScopeUrl(), this.l_appSeqNo, dependent_value, flag).then(function (data) {
      this.fields = data;
      if (flag == 'search') {
      } else {
        this.globalObjectServices.setColumnDependentVal(this.fields, this.globalObjects.getScopeUrl(), this.l_appSeqNo);
      }
    });
  }

  dependent_lov(dependent_row, value) {
    this.fields = this.addUpdateEntryServices.dependent_lov(dependent_row, value, this.fields)
  }

  openLov(column_desc, column_name, dependent_row, dependent_row_logic, item_help_property) {
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

  takeVideo(column_name, column_size) {
    this.addUpdateEntryServices.takeVideo(column_name,column_size,this.fields).then((data) => {
    })
  }

  searchEntry(item, fieldsData) {
    var dependent_row_logic;
    var dependent_row;
    var noOfCall = 0;
    for (let obj of this.fields) {
      if (obj.dependent_row) {
        noOfCall++;
      }
    }
    for (let obj of this.fields) {
      if (obj.dependent_row) {
        if (obj.dependent_row.indexOf(item.column_name) > -1) {
          dependent_row = obj.dependent_row;
          if (dependent_row.indexOf('#') > -1) {
            dependent_row_logic = dependent_row;
            for (let obj1 of this.fields) {
              if (dependent_row.indexOf(obj1.column_name) > -1) {
                if (obj1.value) {
                  dependent_row_logic = dependent_row_logic.replace(obj1.column_name, obj1.value);
                } else {
                  dependent_row_logic = dependent_row_logic.replace(obj1.column_name, "null");
                }
              }
            }
          } else {
            dependent_row_logic = item.value;
          }
          this.fields = this.addUpdateEntryServices.setDependantRowValueSE(obj.column_name, dependent_row_logic, this.l_appSeqNo, item.dependent_row, "", fieldsData, this.globalObjects.getScopeUrl(), noOfCall)
        }
      }
    }
  }

  addNewEntry(fieldsData) {
    var checkForSessionEntry = false;
    var key = "valueToSend";
    var session = {
      sessionvalue: []
    };
    for (let obj of fieldsData) {
      if (obj.session_column_flag == "T") {
        var item = obj;
        session.sessionvalue.push({
          "column_name": item.column_name,
          "value": item.value,
          "codeOfValue": item.codeOfValue
        });
      }
      if (!checkForSessionEntry) {
        if (obj.session_column_flag == "T") {
          checkForSessionEntry = true;
        } else {
          if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {
            if (obj.item_help_property == "L") {
              this.sp_obj.VRNO = obj.codeOfValue;
              obj[key] = obj.codeOfValue;
            } else {
              this.sp_obj.VRNO = obj.value;
              obj[key] = obj.value;
            }
          } else {
            if (obj.column_name == "ENTITY_CODE" || obj.column_desc == "Entity Code") {
              this.sp_obj.ENTITY_CODE = obj.value;
              obj[key] = obj.value;
            } else {
              if (obj.column_name == "TCODE" || obj.column_desc == "TCode") {
                this.sp_obj.TCODE = obj.value;
                obj[key] = obj.value;
              } else {
                if (obj.column_name == "VRDATE" || obj.column_desc == "VRDATE") {
                  if (this.userDetails.entity_code == "PF") {
                    this.sp_obj.VRDATE = this.globalObjects.formatDate(new Date(obj.value), "M-dd-yyyy");
                    obj[key] = this.globalObjects.formatDate(new Date(obj.value), "M-dd-yyyy");
                  } else {
                    this.sp_obj.VRDATE = obj.value;
                    obj[key] = obj.value;
                  }
                } else {
                  if (obj.column_name == "RETAILER_CODE" || obj.column_desc == "Retailer Code") {
                    this.sp_obj.RETAILER_CODE = obj.codeOfValue;
                    obj[key] = obj.codeOfValue;
                  } else {
                    if (obj.column_name == "DIV_CODE") {
                      this.sp_obj.DIV_CODE = obj.codeOfValue;
                      obj[key] = obj.codeOfValue;
                    } else {
                      if (obj.column_name == "GEO_CODE") {
                        this.sp_obj.GEO_CODE = obj.codeOfValue;
                        obj[key] = obj.codeOfValue;
                      } else {
                        if (obj.column_name == "SLNO") {
                          if (obj.value) {
                            obj.value = parseInt(obj.value) + 1;
                            this.sp_obj.SLNO = obj.value;
                            obj[key] = obj.value;
                          } else {
                            obj.value = 1;
                            this.sp_obj.SLNO = obj.value;
                            obj[key] = obj.value;
                          }
                        } else {
                          if (obj.column_name == "ITEM_CODE") {
                            this.sp_obj.ITEM_CODE = obj.codeOfValue;
                            obj[key] = obj.codeOfValue;
                          } else {
                            if (obj.column_name == "UM") {
                              this.sp_obj.UM = obj.value;
                              obj[key] = obj.value;
                            } else {
                              if (obj.column_name == "AUM") {
                                this.sp_obj.AUM = obj.value;
                                obj[key] = obj.value;
                              } else {
                                if (obj.column_name == "ACC_CODE" || obj.column_desc == "Select Dealer" ||
                                  obj.column_desc == "Party Name") {
                                  this.sp_obj.ACC_CODE = obj.codeOfValue;
                                  obj[key] = obj.codeOfValue;
                                } else {
                                  if (obj.column_desc == "Consumer Number") {
                                    this.sp_obj.consumerNumber = obj.value;
                                    obj[key] = obj.value;
                                  } else {
                                    if (obj.column_desc == "Order Date") {
                                      this.sp_obj.Order_Date = obj.value;
                                      obj[key] = obj.value;
                                    } else {
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
                                          } else if (obj.column_type == "DATETIME") {
                                            obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy HH:mm:ss');
                                          } else if (obj.column_type == "DATE") {
                                            obj[key] = this.globalObjects.formatDate(obj.value, 'yyyy-MM-dd');
                                          } else {
                                            if (obj.column_desc.indexOf(".") > -1) {
                                              var copyFrom = obj.column_desc.split(".")[1];
                                              for (let obj2 of fieldsData) {
                                                if (obj2.column_name == copyFrom) {
                                                  obj[key] = obj2.value;
                                                }
                                              }
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
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }

            }
          }
        }
        if (obj.column_name == this.sp_obj.update_key) {
          if (obj.codeOfValue) {
            this.sp_obj.update_key_value = obj.value;
            this.sp_obj.update_key_codeOfValue = obj.codeOfValue;
          } else {
            this.sp_obj.update_key_value = obj.value;
            this.sp_obj.update_key_codeOfValue = obj.value;
          }
        }

      }
    }

    if (this.online) {
      this.dataServices.uploadEntry(fieldsData, this.l_appSeqNo, this.globalObjects.getScopeUrl(), this.l_object.latitude,
        this.l_object.longitude, "Nagpur", "Update", this.sp_obj.seqId, this.sp_obj.dependent_next_entry_seq, this.sp_obj.update_key, this.sp_obj.update_key_value, this.sp_obj.update_key_codeOfValue, this.sp_obj.imageData).then((data: any) => {
          if (data.status == "insert data") {
            if (this.sp_obj.type == "order") {
              this.navCtrl.push('AddUpdateOrderPage',{obj: this.sp_obj})
            } else {
              this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
              this.navCtrl.setRoot('HomePage');
            }
          } else
            if (data.status == "updated data") {
              this.navCtrl.push('HomePage', { sp_obj: this.sp_obj });
              if (this.sp_obj.types == "O") {
                var l_obj: any = [];
                l_obj.listData = fieldsData;
                this.navCtrl.push(SearchEntryPage, { obj: this.sp_obj });
              } else {
                if (this.sp_obj.unique_message) {
                  this.dataServices.executeAfterUpdate(this.globalObjects.getScopeUrl(), fieldsData);
                  this.navCtrl.push(SearchEntryPage, { obj: l_obj });
                }
                if (this.sp_obj.types == 'Q') {
                } else {
                }
              }
            } else {
              this.globalObjects.displayCordovaToast(data.status);
            }
        }, function (err) {
          this.globalObjects.displayErrorMessage(err)
        })
    }
  }
}
