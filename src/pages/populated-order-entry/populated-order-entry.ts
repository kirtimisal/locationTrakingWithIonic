import { Component, NgZone } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
// import { EntryListPage } from '../entry-list/entry-list';
// import { EntryDetailsInTabularPage } from '../entry-details-in-tabular/entry-details-in-tabular';
// import { AddUpdateEntryPage } from '../add-update-entry/add-update-entry';
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';
// import { TextAreaPopoverPage } from '../text-area-popover/text-area-popover';
import { DataServicesProvider } from '../../providers/data-services/data-services';
// import { AddUpdateOrderPage } from '../add-update-order/add-update-order';
// import { HomePage } from '../home/home';

@IonicPage()
@Component({
  selector: 'page-populated-order-entry',
  templateUrl: 'populated-order-entry-form.html',
})
export class PopulatedOrderEntryFormPage {
  defaultPopulateDataLength: any = [];
  default_populated_data: any = [];
  fields: any = []; l_url: string; online: boolean;
  url: string; flagForEntryListButton: any; rowsOfPopulateData: any = []; isReadonly: boolean = true;
  sp_Obj: any; l_userCode: string; l_appSeqNo: any; table_desc: string; searchEntity: any = {}; fieldsTH: any = []; orderPopulatedFlag: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public globalObjects: GlobalObjectsProvider,
    public pouchDb: PouchDBService, private addUpdateEntryServices: AddUpdateEntryServicesProvider, private dataServices: DataServicesProvider,
    public zone: NgZone, public modalCtrl: ModalController) {
    this.sp_Obj = this.navParams.get("obj");
    this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
    this.l_appSeqNo = this.sp_Obj.seqNo;
    this.table_desc = this.sp_Obj.table_desc;
    this.orderPopulatedFlag = this.sp_Obj.access_contrl;
    this.url = this.globalObjects.getScopeUrl();
    this.online = this.globalObjects.getOnlineStatus();
    if (this.sp_Obj.display_clause == '2') {
      this.orderPopulatedFlag = this.sp_Obj.display_clause;
    }
  }
  ionViewDidLoad() {
    if ('V' == this.globalObjects.getLocallData("screenOrientation")) {
      // window.screen.lockOrientation('portrait');
    } else {
      if ("H" == this.globalObjects.getLocallData("screenOrientation")) {
        // window.screen.lockOrientation('landscape');
      }
    }
    if (this.sp_Obj.type == "Update") {
      this.l_url = this.url + 'updateEntryForm?tableSeqNo=' + this.l_appSeqNo + '&entrySeqId=' +
        this.sp_Obj.seqId + '&userCode=' + this.l_userCode;
    } else {
      if ((this.sp_Obj.updation_process).indexOf('V') > -1) {
        this.flagForEntryListButton = 'V#';
      }
      if (this.sp_Obj.access_contrl == 'PO') {
        this.sp_Obj.l_appSeqNo = parseFloat(this.sp_Obj.l_appSeqNo) + parseFloat("0.1");
        this.sp_Obj.l_appSeqNo = parseFloat(this.sp_Obj.l_appSeqNo).toFixed(1);
        this.l_url = this.url + 'addEntryForm?seqNo=' + this.sp_Obj.l_appSeqNo + '&userCode=' + this.l_userCode
          + "&accCode=" + this.globalObjects.getLocallData("userDetails").acc_code + '&searchText=' + encodeURIComponent(this.sp_Obj.searchText);
      } else {
        this.l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.l_userCode;
        this.l_url = this.l_url + "&accCode=" + this.globalObjects.getLocallData("userDetails").acc_code + '&searchText=';
      }
    }
    if (this.sp_Obj.type == "offlineUpdateEntry") {
      var l_obj: any = [];
      if (this.sp_Obj.flagFororder == 1) {
        this.rowsOfPopulateData = this.sp_Obj.orderEntry;
        if (this.rowsOfPopulateData != '') {
          for (var i = 0; i < 1; i++) {
            this.rowsOfPopulateData.forEach(function (obj) {
              l_obj = (obj);
            })
          }
          for (let obj1 of l_obj) {
            if (obj1.entry_by_user == "T" || obj1.entry_by_user == "R" && obj1.entry_by_user !== '') {
              this.fieldsTH.push(obj1.column_desc);
            }
          }
        } else { }
      } else {
        this.rowsOfPopulateData = this.sp_Obj.recordsInfo;
        this.fieldsTH = this.sp_Obj.fieldsTH;
      }
    } else {
      var formId = this.sp_Obj.l_appSeqNo;
      formId = formId + "_seqNo";
      this.pouchDb.getObject(formId).then(dta => {
        let data: any = dta;
        this.fields = data.recordsInfo;
        var searchId = this.sp_Obj.searchText.split(',');
        var default_populated_data: any;
        for (let id of searchId) {
          id = id.trim();
          if (default_populated_data) {
            for (let key in default_populated_data) {
              var temp = data.defaultPopulateData[id];
              default_populated_data[key] = default_populated_data[key].concat(temp[key]);
            }
          } else {
            default_populated_data = data.defaultPopulateData[id];
          }
        }
        if (default_populated_data) {
          this.rowsOfPopulateData = [];
          this.default_populated_data = default_populated_data;
          this.setData();
          this.setTableValue(this.default_populated_data);
        } else {
          this.getDataOnline();
        }
      }, err => {
        this.getDataOnline();
      })
    }
  }

  getDataOnline() {
    this.globalObjects.showLoading();
    this.http.get(this.l_url).map(res => res.json()).subscribe(data => {
      this.globalObjects.hideLoading();
      this.fields = data.recordsInfo;
      this.default_populated_data = data.defaultPopulateData;
      this.setData();
      this.setTableValue(this.default_populated_data);
    }, err => { })
  }
  setData() {
    this.addUpdateEntryServices.setDataCommon(this.fields, "", this.sp_Obj.sessionHB, this.globalObjects.getLocallData("userDetails").acc_code, "", "")
      .then(fields => {
        this.fields = fields;
        var l_auto_calculation_eq: any;
        var l_equationOP: any;
        if (this.sp_Obj.type == "Update") {
          for (let obj1 of this.fields) {
            if ((obj1.updation_process).indexOf("U") > -1) { } else {
              obj1.entry_by_user = "R";
            }
            if (obj1.auto_calculation !== null) {
              l_auto_calculation_eq = obj1.auto_calculation;
              l_equationOP = obj1.column_name;
            }
            for (let obj2 of this.fields) {
              if (obj1.column_name == obj2.dependent_row) {
                obj2.dependent_row_logic = obj1.codeOfValue;
              }
              if ((l_auto_calculation_eq.indexOf(obj2.column_name)) > -1) {
                obj2.auto_calculation = l_auto_calculation_eq;
                obj2.equationOP = l_equationOP;
              }
            }
          }
        } else {
          if (this.sp_Obj.type == "offlineUpdateEntry") {
            for (let obj1 of this.fields) {
              for (let obj2 of this.fields) {
                if (obj1.column_name == obj2.dependent_row) {
                  obj2.dependent_row_logic = obj1.codeOfValue;
                }
              }
              if (obj1.column_type == "VIDEO") {
                obj1.item_help_property = "V";
              }
            }
          } else {
            for (let obj1 of this.fields) {
              if ((obj1.updation_process).indexOf("I") > -1) { } else {
                obj1.entry_by_user = "F";
                obj1.nullable = "T";
              }
            }
          }
        }
      });
  }

  setTableValue(default_populated_data1) {
    var default_populated_data = default_populated_data1;
    for (let obj of this.fields) {
      if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
        this.fieldsTH.push(obj.column_desc);
      }
      delete obj['column_catg'];
      delete obj['para_default_value'];
      delete obj['para_desc'];
      delete obj['para_column'];
      delete obj['status'];
      delete obj['excel_upload'];
      delete obj['temp'];
      delete obj['editor_flag'];
      delete obj['excel_upload'];
      delete obj['query_dependent_row'];
      delete obj['img'];
      delete obj['table_name'];
      delete obj['para_desc'];
      delete obj['ref_LOV_WHERE_CLAUSE'];
      delete obj['ref_LOV_TABLE_COL'];
      delete obj['slno'];
    }
    for (let keyval in default_populated_data) {
      this.defaultPopulateDataLength = Object.keys(default_populated_data[keyval]).length;
    }
    for (var i = 0; i < this.defaultPopulateDataLength; i++) {
      for (let obj of this.fields) {
        var defaultPopulateData = "";
        for (let keyval in default_populated_data) {
          if (keyval == obj.column_name) {
            defaultPopulateData = default_populated_data[obj.column_name];
          }
        }
        if (obj.column_desc == "SLNO") {
          obj.value = i;
        } else {
          if (defaultPopulateData == "undefined" || defaultPopulateData == undefined ||
            defaultPopulateData == "") { } else {
            var dataField = defaultPopulateData[i];
            if (defaultPopulateData[i] != null && defaultPopulateData[i].indexOf("~") > -1) {

              var splitedvalue = dataField.split('~');
              obj.value = splitedvalue[1];
              obj.codeOfValue = splitedvalue[0];
            } else {
              obj.value = defaultPopulateData[i];
            }
          }
        }
        for (let obj1 of this.sp_Obj.sessionvalue) {
          if (obj1.column_name == obj.column_name) {
            obj.codeOfValue = obj1.codeOfValue;
            obj.value = obj1.value;
          }
        }

      }
      var tempCopy = JSON.parse(JSON.stringify(this.fields));
      this.rowsOfPopulateData.push(tempCopy);
    }
    // console.log(JSON.stringify(this.rowsOfPopulateData))
  }
  autoCalculation(column_name) {
    for (let obj1 of this.rowsOfPopulateData) {
      obj1 = this.addUpdateEntryServices.autoCalculation(column_name, obj1);
    }
  }

  entryList() {
    var l_obje: any = [];
    l_obje.seqNo = this.l_appSeqNo;
    l_obje.types = this.sp_Obj.types;
    var dates = new Date();
    l_obje.date2 = this.globalObjects.formatDate(dates, 'dd-MM-yyyy');
    l_obje.table_desc = this.table_desc;
    l_obje.firstScreen = this.sp_Obj.firstScreen;
    l_obje.updation_process = this.sp_Obj.updation_process;
    this.navCtrl.setRoot('EntryListPage');
  }

  addOrder(fieldsData) {
    var key = "valueToSend";
    if (this.online) {
      if (this.sp_Obj.type == "offlineUpdateEntry") {
        if (this.sp_Obj.flagFororder == 1) {
          let entryType = "orderEntry";
          this.dataServices.updateOrderEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_Obj.index,
            this.sp_Obj.tempAppSeqNo, entryType).then(data => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
            }, err => {
              this.globalObjects.displayCordovaToast('Try Again..')
            })
        } else {
          this.dataServices.updateEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_Obj.index).then(data => {
            this.globalObjects.hideLoading();
            this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
          }, err => {
            this.globalObjects.displayCordovaToast('Try Again..')
          })
        }
      } else {
        for (let obj1 of fieldsData) {
          for (let obj of obj1) {
            if (obj.column_type == "DATETIME") {
              obj[key] = this.globalObjects.formatDate(obj.value, 'MM-dd-yyyy hh:mm:ss');
            } else {
              if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
                obj[key] = this.l_userCode;
              } else {
                if (obj.item_help_property == "MD") {
                  if (obj.value || obj.value == '') {
                    obj.value.forEach(function (data) {
                      if (obj[key]) {
                        obj[key] = obj[key] + "," + data;
                      } else {
                        obj[key] = data;
                      }
                    })
                  }
                } else {
                  if (obj.temp != null) {
                    obj[key] = (obj.temp + "#" + obj.value);
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
            if (obj.column_name == "vrno" || obj.column_name == "VRNO" || obj.column_desc == "vrno" || obj.column_desc == "VRNO") {
              if (this.sp_Obj.VRNO) {
                  obj.valueToSend = this.sp_Obj.VRNO;
              }
          }
          }
        }
        if (this.sp_Obj.access_contrl == 'PO' && this.sp_Obj.display_clause != '2') {
          this.functionToSaveOrderDataLocally(fieldsData, "");
        } else {
          if (this.sp_Obj.mandatory_to_start_portal === 'O') {
            this.dataServices.uploadEntry(this.sp_Obj.headOrderEntry.fieldsData, this.sp_Obj.headOrderEntry.l_appSeqNo, this.sp_Obj.headOrderEntry.url, this.sp_Obj.headOrderEntry.l_latitude,
              this.sp_Obj.headOrderEntry.l_longitude, this.sp_Obj.headOrderEntry.l_location, this.sp_Obj.headOrderEntry.type,
              this.sp_Obj.headOrderEntry.seqId, this.sp_Obj.headOrderEntry.dependent_next_entry_seq, this.sp_Obj.headOrderEntry.update_key, this.sp_Obj.headOrderEntry.update_key_value,
              this.sp_Obj.headOrderEntry.update_key_codeOfValue, this.sp_Obj.headOrderEntry.l_base64VideoData).then((res) => {
                this.globalObjects.hideLoading();
                var data: any = res;
                if (data.status == "insert data") {
                  this.sp_Obj.VRNO = data.vrno;
                  this.addUpdateEntryServices.setSlno(1);
                  if (this.sp_Obj.VRNO) {
                      for(let obj1 of fieldsData){
                        for(let obj of obj1 ){
                          if (obj.column_name == "vrno" || obj.column_name == "VRNO" || obj.column_desc == "vrno" || obj.column_desc == "VRNO") {
                            obj.valueToSend = this.sp_Obj.VRNO;
                          }
                        }
                      }
                  }
                  this.dataServices.uploadAllEntry(fieldsData, this.sp_Obj.l_appSeqNo, this.url, "").then(dta => {
                    let data: any = dta;
                    
                    if (data.status == "insert data") {
                      this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
                      this.navCtrl.pop();
                    } else
                      if (data.status == "updated data") {
                        this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
                        this.navCtrl.pop();
                        this.navCtrl.setRoot('HomePage');
                      } else {
                        this.globalObjects.displayCordovaToast(data.status);
                      }
                  }, err => {
                   
                    this.globalObjects.displayErrorMessage(err)
                  });
                } else {
                  this.globalObjects.displayCordovaToast(data.status);
                }
              }, (err) => {
                this.globalObjects.hideLoading();
                this.globalObjects.displayErrorMessage(err)
              })
          } else {
            this.dataServices.uploadAllEntry(fieldsData, this.l_appSeqNo, this.url, "").then(dta => {
              let data: any = dta;
              this.globalObjects.hideLoading();
              if (data.status == "insert data") {
                this.globalObjects.displayCordovaToast('Entry Saved Successfully..')
              } else
                if (data.status == "updated data") {
                  this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
                } else {
                  this.globalObjects.displayCordovaToast(data.status);
                }
            }, err => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayErrorMessage(err)
            });
          }
        }
      }
    } else {
      if (this.sp_Obj.type == "offlineUpdateEntry") {
        if (this.sp_Obj.flagFororder == 1) {
          let entryType = "orderEntry";
          this.dataServices.updateOrderEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_Obj.index,
            this.sp_Obj.tempAppSeqNo, entryType).then(data => {
              this.globalObjects.hideLoading();
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
            }, err => {
              this.globalObjects.displayCordovaToast('Try Again...')
            })
        } else {
          this.dataServices.updateEntryToLoacalDB(fieldsData, this.l_appSeqNo, this.sp_Obj.index).then(data => {
            this.globalObjects.hideLoading();
            this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
          }, err => {
            this.globalObjects.displayCordovaToast('Try Again...')
          })
        }
      } else {
        if (this.sp_Obj.access_contrl == 'PO') {
          for (let obj1 of fieldsData) {
            for (let obj of obj1) {
              if (obj.column_type == "DATETIME") {
                obj[key] = this.globalObjects.formatDate(obj.value, 'MM-dd-yyyy hh:mm:ss');
              } else {
                if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
                  obj[key] = this.l_userCode;
                } else {
                  if (obj.item_help_property == "MD") {
                    if (obj.value || obj.value == '') {
                      for (let data of obj.value) {
                        if (obj[key]) {
                          obj[key] = obj[key] + "," + data;
                        } else {
                          obj[key] = data;
                        }
                      }
                    }
                  } else {
                    if (obj.temp != null) {
                      obj[key] = (obj.temp + "#" + obj.value);
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
          this.functionToSaveOrderDataLocally(fieldsData, "");
        } else {
          var tempDate = this.globalObjects.formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss');
          this.rowsOfPopulateData.push({
            column_desc: "DATE",
            column_name: "DATE",
            column_type: "DATE",
            entry_by_user: "F",
            value: tempDate
          });
          this.dataServices.addEntryToLoacalDB(this.rowsOfPopulateData, this.l_appSeqNo, this.fieldsTH, "", "", "").then(data => {
            if (this.sp_Obj.type == "order") {
              this.navCtrl.push('AddUpdateOrderPage', { obj: this.sp_Obj });
            } else {
              this.globalObjects.hideLoading();
            }
          }, err => {
            this.globalObjects.displayCordovaToast('Try Again...')
          })
        }
      }
    }
  }

  functionToSaveOrderDataLocally(fieldsData, flag) {

    var fieldsDataToSave: any = [];
    for (let obj1 of fieldsData) {
      for (let obj of obj1) {
        if (obj.column_name == 'QTYORDER' && obj.value) {
          fieldsDataToSave.push(obj1);
        }
      }
    }
    var DataValue = [];
    if (fieldsDataToSave.length > 0) {
      var index = 0;
      for (let obj1 of fieldsDataToSave) {
        var entryListDataValue: any = [];
        for (let obj of obj1) {
          entryListDataValue.push({
            "column_desc": obj.column_desc,
            "column_name": obj.column_name,
            "column_default_value": obj.column_default_value,
            "value": obj.value,
            "valueToSend": obj.valueToSend,
            "column_select_list_value": obj.column_select_list_value,
            "codeOfValue": obj.codeOfValue,
            "summary_function_flag": obj.summary_function_flag
          })
        }
        entryListDataValue.push({ "slno": new Date() + "-" + index });
        index++;
        DataValue.push(entryListDataValue);
      }
    }
    this.saveOrderPopulatedEntryOffline(DataValue, fieldsDataToSave, flag);
  }
  saveOrderPopulatedEntryOffline(DataValue, fieldsDataToSave, flag) {
    var id = "entrySeqNo" + this.sp_Obj.l_appSeqNo;
    if (DataValue != "") {
      var tempData: any = [];
      if (this.globalObjects.getLocallData(id)) {
        var data = this.globalObjects.getLocallData(id);
        for (let i of data) {
          tempData.push(i);
        }
        for (let element of DataValue) {
          tempData.push(element);
        }
      } else {
        for (let element of DataValue) {
          tempData.push(element);
        }
      }
      this.globalObjects.setDataLocally(id, tempData);
      if (flag == 'disaplaylist') {
        let data = this.globalObjects.getLocallData(id);
        let l_obje: any = [];
        l_obje.seqNo = this.sp_Obj.l_appSeqNo;
        l_obje.entryList = data;
        l_obje.listData = "";
        l_obje.types = "PO";
        l_obje.searchTextColumnName = this.sp_Obj.searchTextColumnName;
        l_obje.searchText = this.sp_Obj.searchText;
        this.navCtrl.push('EntryDetailsInTabularPage', { obj: l_obje });
      } else {
        this.globalObjects.displayCordovaToast('Entry saved successfully..')
        this.sp_Obj.type = "orderPopulated";
        this.sp_Obj.access_contrl = "PO";
        this.navCtrl.push('AddUpdateEntryPage', { sp_obj: this.sp_Obj }).then(() => {
            this.navCtrl.remove(1);
        });
      }
    } else {
      if (flag == 'disaplaylist') {
        let data = this.globalObjects.getLocallData(id);
        if (data) {
          let l_obje: any = [];
          l_obje.seqNo = this.sp_Obj.l_appSeqNo;
          l_obje.entryList = data;
          l_obje.listData = "";
          l_obje.types = "PO";
          l_obje.searchTextColumnName = this.sp_Obj.searchTextColumnName;
          l_obje.searchText = this.sp_Obj.searchText;
          this.navCtrl.push('EntryDetailsInTabularPage', { obj: l_obje });
        } else {
          this.globalObjects.displayCordovaToast('Add items...')
        }
      } else {
        this.globalObjects.displayCordovaToast('Add items...')
      }
    }
  }
  addPopulatedOrder(fieldsData) {
    this.functionToSaveOrderDataLocally(fieldsData, 'disaplaylist');
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
      this.dependent_nullable_logic(name, column_name, this.fields, this.url)
    });
    SingleSelectLovModal.present();

  }

  dependent_lov(dependent_row, value) {
    this.fields = this.addUpdateEntryServices.dependent_lov(dependent_row, value, this.fields)
  }

  textAreaPopOver(event, column_name, fields, column_desc, value) {
    let textareaEditModal = this.modalCtrl.create('TextAreaPopoverPage', { data1: value });
    textareaEditModal.onDidDismiss(textareaData => {

      for (let obj of this.fields) {
        if (obj.column_name == column_name) {
          obj.value = textareaData
        }
      }
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

  cancelEntry() {
    this.navCtrl.pop();
  }
}
