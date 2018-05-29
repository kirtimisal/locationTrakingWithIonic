import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, ViewController, AlertController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
import { DataServicesProvider } from '../../providers/data-services/data-services';
import { HttpClient } from '@angular/common/http';
// import { TextAreaPopoverPage } from '../text-area-popover/text-area-popover'
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';
import { DatePicker } from '@ionic-native/date-picker';
import { Device } from '@ionic-native/device';

@IonicPage()
@Component({
  selector: 'page-add-update-order',
  templateUrl: 'add-update-order.html',
})
export class AddUpdateOrderPage {

  sp_obj: any = {};
  l_appSeqNo: any;
  table_desc: string;
  orderFormNext: string
  user_code: string
  url: string;
  flagForEntryListButton: boolean;
  online: boolean;
  fields: any = [];
  userDetails: any = {};
  l_object: any = {};
  stars: string[] = [];
  defaultPopulateData: any;
  recordedVideoData: any;
  listOfEntry: any = [];
  l_base64VideoData: any;
  count: any = 1;
  process_count = 0;
  process_entry_count = 0;
  process_code_arr = [];
  newEntrySlno: any;
  isDisabled:boolean=false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker, public pouchDBService: PouchDBService,
    public modalCtrl: ModalController, private globalObjects: GlobalObjectsProvider, public alertCtrl: AlertController,
    private dataServices: DataServicesProvider, public httpClient: HttpClient, public viewCtrl: ViewController,
    private addUpdateEntryServices: AddUpdateEntryServicesProvider, private device: Device) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.l_appSeqNo = ((parseInt(this.l_appSeqNo)) + 0.2);
    this.table_desc = this.sp_obj.table_desc;
    this.online = this.globalObjects.getOnlineStatus();
    this.newEntrySlno = this.addUpdateEntryServices.getSlno();
    if (this.newEntrySlno == 0) {
      this.addUpdateEntryServices.setSlno(1);
      this.newEntrySlno = 1;
    }
  }

  ionViewDidLoad() {
    this.isDisabled=false;
    if ((this.sp_obj.updation_process).indexOf('V') > -1) {
      this.flagForEntryListButton = true;
    }
    let l_url;
    if (this.sp_obj.searchText) {
       l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.user_code;
      l_url = l_url + "&accCode=" + this.userDetails.acc_code + '&searchText=' + encodeURIComponent(this.sp_obj.searchText);
    } else {
       l_url = this.url + 'addEntryForm?seqNo=' + this.l_appSeqNo + '&userCode=' + this.user_code;
      l_url = l_url + "&accCode=" + this.userDetails.acc_code + '&searchText=';
    }

    if (this.online) {
      if (this.sp_obj.type == "offlineUpdateEntry") { } else {
        this.httpClient.get(l_url)
          .subscribe(data => {
            var tempdata: any = {};
            tempdata = data;
            this.defaultPopulateData = tempdata.defaultPopulateData;
            this.addUpdateEntryServices.setDataCommon(tempdata.recordsInfo, "", this.sp_obj.sessionHB, this.userDetails.acc_code, this.userDetails.div_code, this.userDetails.entity_code)
              .then(fields => {
                this.fields = fields;
                this.setData();
              });
          }, err => {
            this.globalObjects.displayErrorMessage(err);
          })
      }
    } else {
      if (this.sp_obj.type == "offlineUpdateEntry") { } else {
        var id = this.l_appSeqNo.toString();
        id = id + "";
        this.pouchDBService.getObject(id).then((obj) => {
          this.globalObjects.hideLoading();
          var data: any = obj;
          for (let obj of data.recordsInfo) {
            if (obj.column_type == "DATE" || obj.column_type == "DATETIME") {
              obj.value = this.globalObjects.formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss')
            }
          }
          this.addUpdateEntryServices.setDataCommon(data.recordsInfo, "", this.sp_obj.sessionHB, this.userDetails.acc_code, this.userDetails.div_code, this.userDetails.entity_code).then((fields) => {
            this.fields = fields;
            this.setData();
          });
        }, err => {
          this.globalObjects.displayErrorMessage(err);
        })
      }
    }
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

  setData() {
    if (this.fields) {
      for (let obj1 of this.fields) {
        if ((obj1.updation_process).indexOf("I") > -1) { } else {
          obj1.entry_by_user = "F";
          obj1.nullable = "T";
        }
        if (obj1.column_desc == "SLNO" || obj1.column_name == "SLNO") {
          if (this.sp_obj.SLNO) {
            obj1.value = parseInt(this.sp_obj.SLNO) + 1;
          } else {
            obj1.value = 1;
          }
        }
        if (obj1.column_name == "VRNO" || obj1.column_desc == "VRNO") {
          if (this.sp_obj.VRNO) {
            obj1.value = this.sp_obj.VRNO;
          }
        }
        if (obj1.column_name == 'APP_IMENO' || obj1.column_default_value == "APP_IMENO") {
          obj1.value = this.device.model + '~~' + this.device.uuid;
        }
        if (obj1.column_default_value == 'APP_GPS') {
          obj1.value = this.l_object.l_latitude + '~~' + this.l_object.l_longitude;
        }

        if ((obj1.item_help_property == "TB")) {
          var head = [];
          var row = [];

          for (let keyval in this.defaultPopulateData) {
            head.push(keyval);
            row.push(this.defaultPopulateData[keyval]);
          }
          obj1.dropdownList = {};
          obj1.dropdownList.rows = this.globalObjects.transpose(row);
          obj1.dropdownList.headers = head;

        }

        if (obj1.column_name == "CASE_NO") {
          obj1.value = this.sp_obj.CASE_NO;
          obj1.codeOfValue = this.sp_obj.CASE_NO;
        }

        if (obj1.summary_function_flag == "T") {
          obj1.summary_function_flag = "Grand Total";
          obj1.summary = 0;
        }

        if (obj1.summary_function_flag == "C") {
          obj1.summary_function_flag = "Count";
          obj1.summary = 0;
        }

        if (obj1.summary_function_flag == "A") {
          obj1.summary_function_flag = "Average";
          obj1.summary = 0;
        }
      }
    }

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

  autoCalculation(column_name) {
    this.fields = this.addUpdateEntryServices.autoCalculation(column_name, this.fields);
  }

  coLumnValidate(column_name, coLumnValidateFun) {
    if (coLumnValidateFun) {
      if (coLumnValidateFun.indexOf("#") > -1) {
        this.fields = this.addUpdateEntryServices.coLumnValidate(column_name, coLumnValidateFun, this.fields);
      } else {

      }
    }
  }

  autoCalculationOfDuration(column_name) {
    this.fields = this.addUpdateEntryServices.autoCalculationOfDuration(this.fields, column_name)
  }

  addItem(fieldsData) {
    this.globalObjects.showLoading();
    var session = {
      sessionvalue: []
    };
    var checkForSessionEntry = false;
    for (let obj of this.fields) {
      if (obj.session_column_flag == "T") {
        var item = obj;
        session.sessionvalue.push({
          "column_name": item.column_name,
          "value": item.value,
          "codeOfValue": item.codeOfValue
        });
        checkForSessionEntry = true;
      }
      if (obj.column_desc == "VRNO" || obj.column_desc == "Retailer Code" ||
        obj.column_desc == "Select Category" || obj.column_desc == "Select Sub Category" ||
        obj.column_desc == "Consumer Number" || obj.column_desc == "Delivery Date") {
        obj.flagforhideValue = 1;
      }
    }
    var user: any = JSON.parse(JSON.stringify(fieldsData));
    this.listOfEntry.push(user);
    var sessionDone: any;
    if (checkForSessionEntry) {
      for (let obj of this.fields) {
        for (let obj1 of fieldsData) {
          if (obj.column_name == obj1.column_name) {
            obj.value = obj1.value;
            obj.codeOfValue = obj1.codeOfValue;
          }
        }
      }
    }
    for (let obj of this.fields) {
      if (obj.summary_function_flag == "Grand Total") {
        if (obj.summary) {
          obj.summary = parseFloat(obj.summary) + parseFloat(obj.value);
        } else {
          if (obj.value) {
            obj.summary = obj.value;
          } else {
            obj.summary = obj.value;
          }
        }
      }
      if (obj.summary_function_flag == "Count") {
        if (obj.summary) {
          obj.summary = parseInt(obj.summary) + 1;
        } else {
          obj.summary = 1
        }
      }

      if (obj.summary_function_flag == "Average") {
        if (obj.summary) {
          obj.summary = ((parseFloat(obj.summary) * (this.count - 1)) + parseFloat(obj.value));
        } else {
          obj.summary = parseFloat(obj.value);
        }
        obj.summary = parseFloat(obj.summary) / parseFloat(this.count)
        this.count++;
      }

      if (obj.column_desc == "SLNO" || obj.column_name == "SLNO") {
        obj.value = parseInt(obj.value) + 1;
      } else {
        if (obj.nullable == "F" && obj.entry_by_user == "F") { } else {
          if (obj.column_name == "RETAILER_CODE" || obj.column_desc == "Consumer Number" ||
            obj.column_desc == "VRNO" || obj.session_column_flag == "T") { } else {
            obj.value = "";
          }
        }
      }
    }
    if (sessionDone == true) {
      var sessionColumn: any;
      var id = "sessionColumn12";
      this.pouchDBService.getObject(id).then((resData) => {
        var data: any = resData;
        sessionColumn = data.data;
        for (let obj2 of this.fields) {
          for (let obj3 of sessionColumn) {
            if (obj3.column_name == obj2.column_name) {
              obj2.value = obj3.value;
              obj2.codeOfValue = obj3.codeOfValue;
            }
          }
        }
      }, err => {
          this.dataServices.storeSessionColumn1(session.sessionvalue);
      })
    }
    this.globalObjects.hideLoading();
  }


  addBodyEntry(listOfEntry, VRNO, process_code) {
    return new Promise((resolve, reject) => {
      this.globalObjects.showLoading();
      var key = "valueToSend";
      var count = 0
      for (let obj1 of this.listOfEntry) {
        for (let obj of obj1) {
          if (obj.column_type == "DATETIME") {
            obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy hh:mm:ss')
          } else {
            if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
              obj[key] = this.user_code
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
                if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {
                  if (VRNO) {
                    obj.value = VRNO;
                    obj[key] = VRNO;
                  } else {
                    if (obj.codeOfValue) {
                      obj[key] = obj.codeOfValue;
                    } else {
                      obj[key] = obj.value;
                    }
                  }
                } else {
                  if (obj.column_name == "PROCESS_CODE") {
                    if (process_code) {
                      obj[key] = process_code;
                    } else {
                      if (obj.codeOfValue) {
                        obj[key] = obj.codeOfValue;
                      } else {
                        obj[key] = obj.value;
                      }
                    }
                  } else {

                    if (obj.temp != null) {
                      obj[key] = (obj.temp + "#" + obj.value);
                    } else {
                      if (obj.codeOfValue != null) {
                        if (obj.codeOfValue == "") {
                          obj[key] = obj.value;
                        } else {
                          obj[key] = obj.codeOfValue;
                        }
                      } else {
                        obj[key] = obj.value;
                      }
                    }

                  }
                }
              }
            }
          }
          if (!this.online) {
            if ((obj.column_type == "DATETIME" || obj.column_type == "DATE") && obj.column_name !== 'VRDATE') {
              if (this.l_object.l_dateTime) {
                obj[key] = this.l_object.l_dateTime;
                obj.value = this.l_object.l_dateTime;
              }
            }
          }
          count++;
        }
        if ("T" == this.sp_obj.data_UPLOAD) {
          obj1.push({
            column_name: "LATITUDE",
            column_desc: "LATITUDE",
            entry_by_user: "F",
            value: this.l_object.l_latitude,
            valueToSend: this.l_object.l_latitude
          });
          obj1.push({
            column_name: "LONGITUDE",
            column_desc: "LONGITUDE",
            entry_by_user: "F",
            value: this.l_object.l_longitude,
            valueToSend: this.l_object.l_longitude
          });
          obj1.push({
            column_name: "LOCATION",
            column_desc: "LOCATION",
            entry_by_user: "F",
            value: this.l_object.l_location,
            valueToSend: this.l_object.l_location
          });
        }
      }
      if (this.online) {
        this.dataServices.uploadAllEntry(this.listOfEntry, this.l_appSeqNo, this.url, "").then((resObj) => {
          this.globalObjects.hideLoading();
          let data: any = resObj;
          if (data.status == "insert data") {
            if (VRNO) {
              let alertVal = this.globalObjects.showAlert(VRNO);
              alertVal.present();
            }
            resolve(VRNO);
          } else
            if (data.status == "updated data") {
              resolve(VRNO);
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
              this.globalObjects.goBack(-2);
            } else {
              this.globalObjects.displayCordovaToast(data.status);
            }
        }, err => {
          resolve();
          this.globalObjects.hideLoading();
          this.globalObjects.displayErrorMessage(err)
        });
      } else {
        var entryType = "orderEntry";
        this.dataServices.addOrderEntryToLoacalDB(this.listOfEntry, this.sp_obj.tempAppSeqNo, entryType,
          this.sp_obj.entryIndex, this.l_object.l_dateTime).then((data) => {
            resolve();
            this.globalObjects.hideLoading();
            this.globalObjects.displayCordovaToast('Entry Saved Successfully..')
            this.globalObjects.goBack(-2);
          }, (err) => {
            resolve();
            this.globalObjects.hideLoading();
            this.globalObjects.displayCordovaToast('Try Again...')
          })
      }

    })
  }

  addHeadEntry(headOrderEntry, process_code) {
    return new Promise((resolve, reject) => {
      this.globalObjects.showLoading();
      this.dataServices.uploadEntry(headOrderEntry.fieldsData, headOrderEntry.l_appSeqNo, headOrderEntry.url, headOrderEntry.l_latitude,
        headOrderEntry.l_longitude, headOrderEntry.l_location, headOrderEntry.type,
        headOrderEntry.seqId, headOrderEntry.dependent_next_entry_seq, headOrderEntry.update_key,
        headOrderEntry.update_key_value, headOrderEntry.update_key_codeOfValue, headOrderEntry.l_base64VideoData)
        .then((resObj) => {
          var data: any = resObj;
          this.globalObjects.hideLoading();
          if (data.status == "insert data") {
            data.process_code = process_code;
          }
          resolve(data);
        })
    })
  }

  addMultipleOrder(listOfEntry) {

    if (this.process_count > this.process_entry_count) {
      for (let obj of this.sp_obj.headOrderEntry.fieldsData) {
        if (obj.column_name == "PROCESS_CODE") {
          obj.valueToSend = this.process_code_arr[this.process_entry_count];
        }
      }
      this.addHeadEntry(this.sp_obj.headOrderEntry, this.process_code_arr[this.process_entry_count]).then((object) => {
        var data: any = object
        this.addBodyEntry(this.listOfEntry, data.vrno, data.process_code).then(data => {
          this.process_entry_count = this.process_entry_count + 1;
          this.addMultipleOrder(this.listOfEntry);
        })
      }, err => {  })
    } else {
      this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
      this.globalObjects.goBack(-2);
    }

  }

  addOrder(listOfEntry) {
    if (this.sp_obj.mandatory_to_start_portal === 'O') {
      if (this.online) {
        this.process_count = 1;
        var process_code = this.sp_obj.PROCESS_CODE;
        if (this.sp_obj.PROCESS_CODE) {
          this.process_code_arr = this.sp_obj.PROCESS_CODE.split('');
          this.process_count = process_code.length;
        }
        if (this.process_count > 1) {
          this.addMultipleOrder(this.listOfEntry);
        } else {
          this.addHeadEntry(this.sp_obj.headOrderEntry, "").then(resData => {
            var data: any = resData;
            var VRNO = data.vrno;
            this.addBodyEntry(this.listOfEntry, VRNO, "").then((data) => {
              this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
              this.globalObjects.goBack(-2);
            });
          }, err => {
            console.log(err);
          })
        }
      } else {
        this.globalObjects.displayCordovaToast("Internet connectivity not detected please reconnect and try again later..");
      }
    } else {
      this.addBodyEntry(this.listOfEntry, "", "").then((data) => {
        this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
        this.globalObjects.goBack(-2);
      }, err => {
        console.log(err);
      });
    }
  }

  addOrderH(listOfEntry) {
    this.globalObjects.showLoading();

    var key = "valueToSend";
    var count = 0
    for (let obj1 of this.listOfEntry) {
      for (let obj of obj1) {
        if (obj.column_type == "DATETIME") {
          obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy hh:mm:ss')
        } else {
          if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
            obj[key] = this.user_code
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
              if (obj.column_name == "VRNO" || obj.column_desc == "VRNO") {

                if (obj.codeOfValue) {
                  obj[key] = obj.codeOfValue;
                } else {
                  obj[key] = obj.value;
                }

              } else {

                if (obj.temp != null) {
                  obj[key] = (obj.temp + "#" + obj.value);
                } else {
                  if (obj.codeOfValue != null) {
                    if (obj.codeOfValue == "") {
                      obj[key] = obj.value;
                    } else {
                      obj[key] = obj.codeOfValue;
                    }
                  } else {
                    obj[key] = obj.value;
                  }
                }
              }
            }

          }
        }
        if (!this.online) {
          if ((obj.column_type == "DATETIME" || obj.column_type == "DATE") && obj.column_name !== 'VRDATE') {
            if (this.l_object.l_dateTime) {
              obj[key] = this.l_object.l_dateTime;
              obj.value = this.l_object.l_dateTime;
            }
          }
        }
        count++;
      }
      if ("T" == this.sp_obj.data_UPLOAD) {
        obj1.push({
          column_name: "LATITUDE",
          column_desc: "LATITUDE",
          entry_by_user: "F",
          value: this.l_object.l_latitude,
          valueToSend: this.l_object.l_latitude
        });
        obj1.push({
          column_name: "LONGITUDE",
          column_desc: "LONGITUDE",
          entry_by_user: "F",
          value: this.l_object.l_longitude,
          valueToSend: this.l_object.l_longitude
        });
        obj1.push({
          column_name: "LOCATION",
          column_desc: "LOCATION",
          entry_by_user: "F",
          value: this.l_object.l_location,
          valueToSend: this.l_object.l_location
        });
      }
    }
    if (this.online) {
      this.dataServices.uploadAllEntry(this.listOfEntry, this.l_appSeqNo, this.url, "")
        .then((resObj) => {
          var data: any = resObj
          this.globalObjects.hideLoading();
          if (data.status == "insert data") {
            this.globalObjects.displayCordovaToast('Entry Saved Successfully..')
            this.globalObjects.goBack(-2);
          } else
            if (data.status == "updated data") {
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..')
              this.globalObjects.goBack(-2);
            } else {
              this.globalObjects.displayCordovaToast(data.status);
            }
        }, err => {
          this.globalObjects.hideLoading();
          this.globalObjects.displayErrorMessage(err)
        });
    } else {
      var entryType = "orderEntry";

      this.dataServices.addOrderEntryToLoacalDB(this.listOfEntry, this.sp_obj.tempAppSeqNo, entryType,
        this.sp_obj.entryIndex, this.l_object.l_dateTime)
        .then((data) => {
          this.globalObjects.hideLoading();
          this.globalObjects.displayCordovaToast('Entry Saved Successfully..')
          this.globalObjects.goBack(-2);
        }, err => {
          this.globalObjects.hideLoading();
          this.globalObjects.displayCordovaToast('Try Again...')
        })
    }
  }

  cancelAddUpdateEntry() {
    let alertVal = this.globalObjects.confirmationPopup('Do you want to Cancel Entry?');
    alertVal.present();
    alertVal.onDidDismiss((data) => {
      if (data == true) {
        this.navCtrl.pop();
      }
    });
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
    paramValue.user_code = this.user_code;
    paramValue.appSeqNo = this.l_appSeqNo;
    paramValue.fields = this.fields;

    let SingleSelectLovModal = this.modalCtrl.create('SingleSelectLovPage', { paramValue: paramValue });
    SingleSelectLovModal.onDidDismiss(fieldsData => {
      this.dependent_nullable_logic(name, column_name, this.fields, this.url)
    });
    SingleSelectLovModal.present();

  }


  /* To set Dependent Lov */
  dependent_lov(dependent_row, value) {
    this.fields = this.addUpdateEntryServices.dependent_lov(dependent_row, value, this.fields)
  }

  /* Click letter event */
  searchLovbyAlpha(id) {
    // this.addUpdateEntryServices.searchLovbyAlpha(id)
  }

  /* Open Pop over for TextArea editor in ADD_UPDATE Entry Form */
  textAreaPopOver(event, column_name, value, column_desc) {
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

  /* dependent_nullable_logic - Make particular control manditory on the basis of selected value in dependent control */
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

  /* To Take Image */
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

  takeVideo(column_name, column_size) {
    this.addUpdateEntryServices.takeVideo(column_name, column_size, this.fields).then((data) => {
    })
  }
  /* To search values By Text */
  searchByText(column_name, value, dependent_column_name, query_dependent_row) {
    this.globalObjects.showLoading();
    var arr = [];
    var col_dsc = "";
    for (let obj of this.listOfEntry) {
      for (let obj1 of obj) {
        if (obj1.column_name == column_name) {
          if (obj1.value) {
            arr.push(obj1.value);
            col_dsc = obj1.column_desc;
          }
        }
      }
    }
    if (arr.indexOf(value) > -1) {
      let alertVal = this.globalObjects.showAlert(col_dsc + "(" + value + ") is already Added.");
      alertVal.present();
    } else {

      if (dependent_column_name) {

        if (query_dependent_row) {
          var qdr = query_dependent_row.split('#');
          var qdr_value = qdr;
          for (let obj of this.fields) {
            if (column_name == obj.column_name) {
              obj.value = value;
            }
            if (qdr.indexOf(obj.column_name) > -1) {
              if (obj.codeOfValue) {
                qdr_value[qdr.indexOf(obj.column_name)] = obj.codeOfValue;
              } else {
                qdr_value[qdr.indexOf(obj.column_name)] = obj.value;
              }

            }
          }
          value = qdr_value.join('~');
        }

        this.addUpdateEntryServices.setselfDependantRowValue(this.url, column_name, this.l_appSeqNo, value, this.fields)
          .then((data) => {
            this.globalObjects.hideLoading();
            if (data) {
              var listDependentValue: any = data;
              if (listDependentValue.length > 0) {
                for (let obj1 of listDependentValue) {
                  for (let obj of this.fields) {
                    if (obj1.columnName == obj.column_name) {
                      obj.value = obj1.value;
                    }
                  }
                  if (obj1.columnName == "WO_VRNO") {
                    if (obj1.value) {
                    } else {
                      let alertVal = this.globalObjects.showAlert("Balance not available in selected Job Card or Selected PROCESS doesn't match.");
                      alertVal.present();
                    }
                  }
                }
              } else {
                if (column_name == "BalanceQty" || column_name == "JOBSHEET_VRNO") {

                  let alertVal = this.globalObjects.showAlert("Balance not available in selected Job Card or Selected PROCESS doesn't match.");
                  alertVal.present();
                } else {
                  // console.log("data not available for column_name " + column_name)
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

  }

  scanBarcode(column_name, coLumnValidate) {
    if (coLumnValidate) {
      this.addUpdateEntryServices.scanBarcode(this.fields, column_name, this.url, this.l_appSeqNo, this.listOfEntry, this.sp_obj.table_desc)
        .then((fields) => {
          this.fields = fields;
          for (let data of this.fields) {
            if (column_name == data.column_name) {
              this.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
            }
          }
        })
    } else {
      this.addUpdateEntryServices.scanBarcode(this.fields, column_name, this.url, this.l_appSeqNo, this.listOfEntry, this.sp_obj.table_desc)
        .then((fields) => {
          this.fields = fields;
          for (let data of this.fields) {
            if (column_name == data.column_name) {
              this.dependent_nullable_logic(data.value, data.column_name, data.dependent_column_name, '');
            }
          }
        })
    }
  }

  /* confirmation Popup Before deleting Entry */
  confirmationTodeleteEntry(item, index) {
    let alertVal = this.globalObjects.confirmationPopup('Do you want to Delete this item?');
    alertVal.present();
    alertVal.onDidDismiss((data) => {
      if (data == true) {
        this.deleteEntry(item, index);
      }
    });
  }

  /* To delete Entry */
  deleteEntry(item, x) {
    this.listOfEntry.splice(x, 1);
    var t = "";
    var a = "";
    for (let obj of item) {
      if (obj.summary_function_flag == "Grand Total") {
        t = obj.value
      }
      if (obj.summary_function_flag == "Average") {
        a = obj.value;
      }
    }
    for (let obj of this.fields) {
      if (obj.summary_function_flag == "Grand Total") {
        if (obj.summary) {
          obj.summary = parseFloat(obj.summary) - parseFloat(t);
        } else {
          obj.summary = t;
        }
      }
      if (obj.summary_function_flag == "Count") {
        if (obj.summary) {
          obj.summary = parseInt(obj.summary) - 1;
        } else {
          obj.summary = 0
        }
      }
      if (obj.summary_function_flag == "Average") {
        this.count--;
        if (this.count == 1) {
          obj.summary = 0;
        } else {
          if (obj.summary) {
            obj.summary = ((parseFloat(obj.summary) * (this.count)) - parseFloat(a));
          } else {
            obj.summary = parseFloat(a);
          }
          obj.summary = parseFloat(obj.summary) / parseFloat((this.count - 1).toString())
        }
      }
      if (obj.column_desc == "SLNO" || obj.column_name == "SLNO") {
        obj.value = parseInt(obj.value) - 1;
      }
    }
    var slno = 1;
    for (let obj1 of this.listOfEntry) {
      for (let obj2 of obj1) {
        if (obj2.column_desc == "SLNO" || obj2.column_name == "SLNO") {
          obj2.value = slno;
          slno++;
        }
      }
    }
  }
  addEntry(fields) {
    this.globalObjects.showLoading();
    var key = "valueToSend";
    var vrdate = "";
    var isSaveEntry = true;

    for (let obj of fields) {
      if (obj.column_name == "SLNO") {
        obj[key] = this.newEntrySlno;
        this.newEntrySlno++;
      } else {
        if (obj.column_type == "DATETIME") {
          obj[key] = this.globalObjects.formatDate(obj.value, 'dd-MM-yyyy hh:mm:ss');
        } else {
          if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
            obj[key] = this.user_code
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
              if (obj.column_name == "VRNO") {
                obj[key] = this.sp_obj.VRNO;
              } else {
                if (obj.column_name == "VRDATE") {
                  vrdate = obj.value
                  obj[key] = obj.value;
                } else {
                  if (obj.temp != null) {
                    obj[key] = (obj.temp + "#" + obj.value);
                  } else {
                    if (obj.codeOfValue != null) {
                      if (obj.codeOfValue == "") {
                        obj[key] = obj.value;
                      } else {
                        obj[key] = obj.codeOfValue;
                      }
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
      if (!this.online) {
        if (obj.column_type == "DATETIME" || obj.column_type == "DATE") {
          if (this.l_object.l_dateTime) {
            obj[key] = this.l_object.l_dateTime;
            obj.value = this.l_object.l_dateTime;
          }

        }
      }
    }
    if ("T" == this.sp_obj.data_UPLOAD) {
      this.fields.push({
        column_name: "LATITUDE",
        entry_by_user: "F",
        value: this.l_object.l_latitude,
        valueToSend: this.l_object.l_latitude
      });
      this.fields.push({
        column_name: "LONGITUDE",
        entry_by_user: "F",
        value: this.l_object.l_longitude,
        valueToSend: this.l_object.l_longitude
      });
      this.fields.push({
        column_name: "LOCATION",
        entry_by_user: "F",
        value: this.l_object.l_location,
        valueToSend: this.l_object.l_location
      });
    }

    if (this.online) {

      if (vrdate) {
        var vrdate1 = this.globalObjects.formatDate(vrdate, 'dd-MM-yyyy');
        ToDate = this.globalObjects.formatDate(new Date(), 'dd-MM-yyyy');

        var year = vrdate1.substring(6, 10); //6 character
        var month = vrdate1.substring(3, 5);
        var date = vrdate1.substring(0, 2);
        var endYear = ToDate.substring(6, 10);
        var endMonth = ToDate.substring(3, 5);
        var endDate = ToDate.substring(0, 2);

        var vrdate2 = new Date(parseInt(year), parseInt(month) - 1, parseInt(date));
        var ToDate = new Date(parseInt(endYear), (endMonth) - 1, parseInt(endDate));

        if (vrdate2.getTime() < ToDate.getTime()) {
          this.globalObjects.hideLoading();
          let alertVal = this.globalObjects.showAlert("Please Re-Enter data, as date is changed");
          alertVal.present();
          isSaveEntry = false;
          this.navCtrl.pop();
        }
      }

      if (isSaveEntry) {
        this.dataServices.uploadEntry(this.fields, this.l_appSeqNo, this.url, this.l_object.l_latitude,
          this.l_object.l_longitude, this.l_object.l_location, "Update",
          this.sp_obj.seqId, this.sp_obj.dependent_next_entry_seq, this.sp_obj.update_key, this.sp_obj.update_key_value,
          this.sp_obj.update_key_codeOfValue, "base64videoData")
          .then((resObj) => {
            var data: any = resObj;
            this.globalObjects.hideLoading();
            if (data.status == "updated data") {
              var msg = "Entry Updated Successfully.<br>";
              if (this.sp_obj.VRNO) {
                msg = msg + " VRNO : " + this.sp_obj.VRNO
              }
              let confirmPopup = this.alertCtrl.create({
                title: 'Confirmation',
                message: msg,
                buttons: [
                  {
                    text: 'Exit',
                    role: 'cancel',
                    handler: () => {
                      confirmPopup.dismiss(false);
                      this.navCtrl.popToRoot();
                      return false;
                    }
                  },
                  {
                    text: 'Continue',
                    handler: () => {
                      confirmPopup.dismiss(true);
                      this.ionViewDidLoad();
                      return false;
                    }
                  }
                ]
              });
              confirmPopup.present();
            } else {
              this.isDisabled=false;
              this.globalObjects.displayCordovaToast(data.status);
            }
          }, (err) => {
            this.globalObjects.hideLoading();
            this.globalObjects.displayErrorMessage(err)
          });
      }
    } else {
      this.globalObjects.hideLoading();
      this.globalObjects.displayCordovaToast('Network is not available, Try again...')
    }
  }

  addNewEntry(fields) {
    this.globalObjects.showLoading();
    if (this.sp_obj.mandatory_to_start_portal === 'O') {
      this.addHeadEntry(this.sp_obj.headOrderEntry, "").then((resdata) => {
        var data: any = resdata;
        this.sp_obj.mandatory_to_start_portal = 'E';
        this.globalObjects.hideLoading();
        this.sp_obj.VRNO = data.vrno;
        this.addEntry(fields);
      }, (err) => {
      })
    } else {
      this.addEntry(fields);
    }
  }

}
