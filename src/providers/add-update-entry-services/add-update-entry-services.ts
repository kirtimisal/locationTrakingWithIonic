import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file';
import { DatePipe } from '@angular/common';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { MediaCapture, MediaFile, CaptureVideoOptions } from '@ionic-native/media-capture';
import { Geolocation } from '@ionic-native/geolocation';
import { PouchDBService } from '../pouchDB/pouchServies';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

@Injectable()
export class AddUpdateEntryServicesProvider {
  response: any;
  online: boolean;
  slno: number = 0;
  depentRowCount: any;
  calldepentRowCount: any = 0;
  constructor(private camera: Camera, public barcode: BarcodeScanner, private file: File, public http: HttpClient, public geoLocation: Geolocation, public pouchDBService: PouchDBService, public globalObjects: GlobalObjectsProvider, public mediaCapture: MediaCapture) {
    this.online = this.globalObjects.getOnlineStatus();
  }

  setData(fields, vrno, sessionHB, acc_code, div_code, entity_code) {
    return new Promise((resolve, reject) => {
      var column_catg_value = "";
      var datePipe = new DatePipe("en-US");
      for (let obj1 of fields) {
        if (sessionHB) {
          if (sessionHB.length > -1) {
            for (let obj2 of sessionHB) {
              if (obj2.column_name == obj1.column_name) {
                obj1.value = obj2.value;
                obj1.codeOfValue = obj2.codeOfValue;
              }
            }
          }
        }
        if (obj1.column_catg != null || column_catg_value) {
          if (column_catg_value == obj1.column_catg) {
            obj1.flagForNewcolumn_catg_value = 1;
          } else {
            obj1.flagForNewcolumn_catg_value = 2;
            if (obj1.column_catg) {
              column_catg_value = obj1.column_catg;
            } else {
              obj1.column_catg = '';
              column_catg_value = '';
            }
          }
        }
        if (obj1.item_help_property == "H" || (obj1.item_help_property == "MD")) {
          var dropdownList = obj1.dropdownVal.split("#");
          var temp1 = [];
          for (let element of dropdownList) {
            var temp2 = element.split("~");
            temp1.push({ name: temp2[1], code: temp2[0] });
          }
          obj1.dropdownList = temp1;
          if (obj1.value) {
            for (let obj of temp1) {
              if (obj.name == obj1.value) {
                obj1.value = obj.code;
                obj1.codeOfValue = null;
              }
            }
          }
        }
        if (obj1.item_help_property == "MT") {
          var date = new Date();
          obj1.value = datePipe.transform(date, 'dd-MM-yyyy HH:mm:ss');
        }
        if (obj1.item_help_property == "D") {
          obj1.dropdownList = obj1.dropdownVal.split("#");
        }
        if (obj1.item_help_property == "AS") {
          obj1.dropdownList = obj1.dropdownVal.split("#");
        }
        if (obj1.column_type == "BARCODE") {
          obj1.item_help_property = "B";
        }
        if (obj1.column_type == "VIDEO") {
          obj1.item_help_property = "V";
          if (obj1.value) {
            obj1.value = 'data:video/mp4;base64,' + obj1.value;
          }
        }
        if (obj1.column_type == "IMG" && obj1.item_help_property !== "S") {
          obj1.item_help_property = "I";
          if (obj1.column_default_value) {
            obj1.value = "";
          }
        }
        if (obj1.column_type == "DATETIME" || obj1.data_type == "DATETIME") {
          if (obj1.entry_by_user == 'R') {
            obj1.item_help_property = "T";
          } else {
            obj1.item_help_property = "DT";
            let t = new Date(new Date().getTime() + (obj1.to_value * 24 * 60 * 60 * 1000));
            let f = new Date(new Date().getTime() + (obj1.from_value * 24 * 60 * 60 * 1000));
            obj1.from_value = datePipe.transform(f, 'yyyy-MM-dd');
            obj1.to_value = datePipe.transform(t, 'yyyy-MM-dd');
          }
        }
        if (obj1.column_type == "DATE" || obj1.data_type == "DATE") {
          if (obj1.entry_by_user == 'R') {
            obj1.item_help_property = "T"
          } else {
            obj1.item_help_property = "C";
            let t; let f;
            if (obj1.to_value) {
              t = new Date(new Date().getTime() + (parseInt(obj1.to_value) * 24 * 60 * 60 * 1000));
            } else {
              t = new Date(new Date().getTime() + (0 * 24 * 60 * 60 * 1000));
            }
            if (obj1.from_value) {
              f = new Date(new Date().getTime() + (-parseInt(obj1.from_value) * 24 * 60 * 60 * 1000));
            } else {
              f = new Date(new Date().getTime() + (0 * 24 * 60 * 60 * 1000));
            }
            obj1.to_value = datePipe.transform(t, 'yyyy-MM-dd');
            obj1.from_value = datePipe.transform(f, 'yyyy-MM-dd');
          }
        }
        if (obj1.column_type == "NUMBER" || obj1.data_type == "NUMBER") {
          if (obj1.item_help_property !== "L") {
            obj1.item_help_property = "N";
            if (obj1.decimal_digit) {
              obj1.pattern = "^[0-9]+(\.[0-9]{1," + obj1.decimal_digit + "})?$";
            }
          }
        }
        if (obj1.column_type == "BUTTON") {
          obj1.item_help_property = "BT";
          obj1.status = '';
        }

        if (obj1.dependent_row == null) {
          obj1.excel_upload = ''; //variable "excel_upload" is used from web service generated JSON,to disable dependent controls 
        } else {
          obj1.excel_upload = 1;
        }

        if (obj1.column_type == "BUTTON") {
          obj1.item_help_property = "BT";
          obj1.status = '';
        }

        if (obj1.column_name == "acc_code") {
          if (!obj1.value) {
            obj1.value = acc_code;
          }
        } else {
          if (obj1.column_name == "div_code") {
            if (!obj1.value) {
              if (div_code) {
                obj1.value = div_code;
              }
            }
          } else {
            if (vrno) {
              if (obj1.column_desc == "VRNO" || obj1.column_name == "VRNO") {
                obj1.value = vrno;
              } else {
                if (obj1.column_desc == "DOC_REF" || obj1.column_name == "DOC_REF") {
                  obj1.value = vrno;
                }
              }
            } else {
              if (obj1.column_name == "entity_code" || obj1.column_name == "ENTITY_CODE") {
                if (entity_code) {
                  obj1.value = entity_code;
                }
              }
            }
          }
        }
        if (obj1.column_default_value != null) {
          if ((obj1.column_name == 'SERIES' || obj1.column_name == 'series') && (obj1.column_default_value.indexOf("USER_RIGHTS") > -1) && obj1.value == "") {
            let alertVal = this.globalObjects.showAlert("You don't have rights of this Entry");
            alertVal.present();
          }
        }
      }
      resolve(fields);
    })

  }

  setDataCommon(fields, vrno, sessionHB, acc_code, div_code, entity_code) {
    return new Promise((resolve, reject) => {
      var sessionColumn = [];
      var id = "sessionColumn12";
      this.pouchDBService.getObject(id).then((res) => {
        var data: any = res;
        sessionColumn = data.data;
        for (let obj2 of fields) {
          for (let obj3 of sessionColumn) {
            if (obj3.column_name == obj2.column_name) {
              obj2.value = obj3.value;
              obj2.codeOfValue = obj3.codeOfValue;
              for (let obj3 of fields) {
                if (obj3.dependent_row) {
                  if (obj3.dependent_row.indexOf(obj2.column_name) > -1) {
                    if (obj3.item_help_property == 'L') {
                      if (obj2.codeOfValue) {
                        obj3.dependent_row_logic = obj2.codeOfValue;
                      } else {
                        obj3.dependent_row_logic = obj2.value;
                      }
                      obj3.value = "";
                      obj3.codeOfValue = "";
                    }
                  }
                }
              }
            }
          }
        }
        this.setData(fields, vrno, sessionHB, acc_code, div_code, entity_code).then((res) => {
          fields = JSON.parse(JSON.stringify(res));
          resolve(fields);
        })

      }, err => {
        this.setData(fields, vrno, sessionHB, acc_code, div_code, entity_code).then((res) => {
          fields = JSON.parse(JSON.stringify(res));
          resolve(fields);
        })
      })
    })
  }


  dependent_lov(dependent_row, value, fields) {
    for (let obj of fields) {
      if (dependent_row) {
        if (obj.dependent_row == dependent_row) {
          if (obj.item_help_property == 'L') {
            obj.dependent_row_logic = value;
            obj.value = "";
            obj.codeOfValue = "";
          }
        }
      }
    }
    return fields;
  }


  dependent_nullable_logic(value, column_name, g_fields, url, l_appSeqNo, dependent_value, flag) {
    return new Promise((resolve, reject) => {
      var query_dependent_row;
      for (let obj1 of g_fields) {
        if (obj1.dependent_nulable_logic != null) {
          var l_dependent_nulable_logic = obj1.dependent_nulable_logic;
          if ((l_dependent_nulable_logic).indexOf("~") > -1) {
            let l_splitedValue = l_dependent_nulable_logic.split("~");
            var l_splitedValue1 = l_splitedValue[0].split("=");
            var l_splitedValue2 = l_splitedValue1[1].split("'").join('');
            var l_value = l_splitedValue2;
            obj1.tool_tip = "";
            if (l_splitedValue1[0] == column_name) {
              if (l_value == value) {
                obj1.nullable = 'F';
                obj1.tool_tip = l_splitedValue[1];
              } else {
                obj1.nullable = 'T';
                obj1.tool_tip = obj1.tool_tip;
              }
            }
          } else {
            if (((l_dependent_nulable_logic).indexOf("#") > -1) && (obj1.column_name == column_name)) {
              let l_splitedValue = l_dependent_nulable_logic.split("#");
              {
                for (let obj2 of g_fields) {
                  var i = 0;
                  for (i = 0; i < l_splitedValue.length; i++) {
                    if (l_splitedValue[i] == obj2.column_name) {
                      obj2.value = "";
                    }
                  }
                }
              }
            }
          }
        }
        if (obj1.column_name == column_name) {
          query_dependent_row = obj1.query_dependent_row;
        }
      }

      if (dependent_value && flag !== 'search') {
        if (query_dependent_row) {
          var qdr = query_dependent_row.split('#');
          var qdr_value = qdr;
          for (let obj of g_fields) {
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

        this.setselfDependantRowValue(url, column_name, l_appSeqNo, value, g_fields).then((data) => {
          if (data) {
            var listDependentValue: any = [];
            listDependentValue = JSON.parse(JSON.stringify(data));
            for (let obj1 of listDependentValue) {
              for (let obj of g_fields) {
                if (obj1.columnName == obj.column_name) {
                  obj.value = obj1.value;
                }
              }
            }
          }
          resolve(g_fields);
        });
      } else {
        resolve(g_fields);
      }
    })
  }


  callsetdepentRow(setDependantRowArr, fields) {
    return new Promise((resolve) => {
      if (this.calldepentRowCount == this.depentRowCount) {
        resolve(fields);
      } else {
        if (setDependantRowArr.length > this.calldepentRowCount) {
          var column_name = setDependantRowArr[this.calldepentRowCount].column_name;
          var name = setDependantRowArr[this.calldepentRowCount].whereClauseValue;
          var l_appSeqNo = setDependantRowArr[this.calldepentRowCount].l_appSeqNo;
          var type = setDependantRowArr[this.calldepentRowCount].type;
          var s_url = setDependantRowArr[this.calldepentRowCount].l_url
          var table_desc = setDependantRowArr[this.calldepentRowCount].table_desc
          if (this.online) {
            if (type == "offlineUpdateEntry") { } else {
              var url = s_url + 'dependantRowValue?forWhichcolmn=' + column_name + '&whereClauseValue=' +
                encodeURIComponent(name) + '&uniquKey=' + l_appSeqNo;
              var data: any;
              this.http.get(url).subscribe(data1 => {
                data = data1;
                if (data && data.value) {
                  var temp = data.value;
                  var tempCode = data.code;
                  var temp1 = true
                  for (let obj of fields) {
                    if (temp1) {
                      if (obj.column_name == column_name) {
                        obj.value = temp;
                        obj.codeOfValue = tempCode;
                        temp1 = false;
                      }
                    }
                  }
                  if (column_name == "COL6" && table_desc == "Bundle Image Entry" && parseInt(data.value) <= 0) {
                    let alertVal = this.globalObjects.showAlert("All Bundle images are captured.");
                    alertVal.present();
                  }
                } else {
                  if (column_name == "BalanceQty") {
                    let alertVal = this.globalObjects.showAlert("Balance not available in selected Job Card or Selected PROCESS doesn't match.");
                    alertVal.present();
                  } else {
                  }
                }
                this.calldepentRowCount = this.calldepentRowCount + 1;
                this.callsetdepentRow(setDependantRowArr, fields).then((data) => {
                  fields = data;
                  resolve(fields);
                })
              }, err => {
                this.calldepentRowCount = this.calldepentRowCount + 1;
                this.callsetdepentRow(setDependantRowArr, fields).then((data) => {
                  fields = data;
                  resolve(fields);
                })
              })
            }
          } else {
            if (type == "offlineUpdateEntry") {
            } else {
              var temp = '';
              var temp1 = true
              for (let obj of fields) {
                if (temp1) {
                  if (obj.column_name == column_name) {
                    obj.value = temp;
                    temp1 = false;
                    obj.nullable = 'T';
                    if (obj.entry_by_user == 'R') {
                      obj.entry_by_user = 'T';
                    }
                  }
                }
              }
              this.callsetdepentRow(setDependantRowArr, fields).then((data) => {
                fields = data;
                resolve(fields);
              })
            }
          }
        }
      }
    })
  }

  setDependantRowValue(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url, table_desc) {
    return new Promise((resolve, reject) => {
      var hold = true;
      var set = true;
      var setDependantRowArr = [];
      for (let obj of fields) {
        if (obj.dependent_row) {
          if (obj.dependent_row.indexOf(column_name) > -1) {
            hold = false;
            if (obj.item_help_property == 'L' || obj.item_help_property == 'AS') {
            } else {
              if (obj.dependent_row.indexOf(column_name) > -1) {
                var whereClauseValue = obj.dependent_row;
                var arr = obj.dependent_row.split('#');
                for (let data of fields) {
                  if (arr.indexOf(data.column_name) > -1) {
                    if (data.codeOfValue) {
                      whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                    } else {
                      whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                    }
                  }
                }
                var aa: any = {};
                aa.column_name = obj.column_name;
                aa.whereClauseValue = whereClauseValue;
                aa.l_appSeqNo = l_appSeqNo;
                aa.dependent_row = dependent_row
                aa.type = "";
                aa.fields = fields;
                aa.l_url = s_url;
                aa.table_desc = table_desc;
                setDependantRowArr.push(aa);
              }
            }
          }
        }
      }

      if (setDependantRowArr.length > 0) {
        set = false;
        this.calldepentRowCount = 0;
        this.depentRowCount = setDependantRowArr.length;
        this.callsetdepentRow(setDependantRowArr, fields).then((data) => {
          fields = data;
          resolve(fields);
        })
      } else {
        resolve(fields);
      }

      if (hold && set) {
        resolve(fields);
      }
    })
  }


  operators = ["+", "-", "*", "/", "(", ")", "^", ">", "<", "<=", ">="];

  isOperator(value) {
    if (value) {
      if (this.operators.indexOf(value) > -1) {
        return true;
      }
    }
    return false;
  }


  autoCalculation(column_name, fields) {
    var formula = [];
    var resutl: any = '';
    for (let obj2 of fields) {
      if (obj2.auto_calculation) {
        if ((obj2.auto_calculation.indexOf(column_name)) > -1) {
          var arr = obj2.auto_calculation.split("#")
          for (var i = 0; i < arr.length; i++) {
            if (!this.isOperator(arr[i]) && arr[i] !== '') {
              for (let obj of fields) {
                if (obj.column_name == arr[i]) {
                  formula[i] = obj.value;
                }
              }
            } else {
              if (arr[i] !== '') {
                formula[i] = arr[i];
              }
            }
          }

          var subRes = ""
          for (var l = 0; l < formula.length; l++) {
            if (formula[l] == "/" || formula[l] == "*") {
              subRes = this.operator[(formula[l])](parseFloat(formula[(l - 1)]), parseFloat(formula[(l + 1)]));
              formula[(l - 1)] = subRes;
              formula.splice(l, 1)
              formula.splice(l, 1)
            }
          }
          if (formula.length > 0) {
            if (formula.length == 1) {
              resutl = formula[0];
            } else {
              for (let j = 0; j < formula.length; j++) {
                if (this.isOperator(formula[j])) {
                  resutl = this.operator[(formula[j])](parseFloat(formula[(j - 1)]), parseFloat(formula[(j + 1)]));
                  formula[(j + 1)] = resutl;
                  j = j + 1;
                }
              }
            }
          }
          for (let obj1 of fields) {
            if (obj1.column_name == obj2.column_name) {
              var factor: any = "1" + Array(+(parseInt(obj1.decimal_digit) > 0 &&
                parseInt(obj1.decimal_digit) + 1)).join("0");
              obj1.value = Math.round(resutl * factor) / factor;
              if (obj1.value) {
              } else {
                obj1.value = "";
              }
              for (let obj3 of fields) {
                if (obj3.auto_calculation) {
                  if ((obj3.auto_calculation.indexOf(obj1.column_name)) > -1) {
                    this.autoCalculation(obj1.column_name, fields)
                  }
                }
              }
            }
          }
        }
      }
    }
    return fields;
  }


  rowWiseAutoCalculation(auto_calculation, equationOP, tableData, seqId, recordsInfo, g_tableData) {
    var formula = [];
    var resutl;
    var l_tableData = [];
    let j = 0;
    var l_seqId;
    for (let obj1 of tableData) {
      l_seqId = (obj1.length) - 1;
      if (obj1[l_seqId] == seqId) {
        l_tableData.push(obj1);
      }
    }
    for (let obj1 of l_tableData) {
      for (let obj of recordsInfo) {
        if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
          obj.value = obj1[j];
          j++;
        }
      }
    }

    if (auto_calculation) {
      var arr = auto_calculation.split("#")
      for (var i = 0; i < arr.length; i++) {
        if (!this.isOperator(arr[i]) && arr[i] !== '') {
          for (let obj of recordsInfo) {
            if (obj.column_name == arr[i]) {
              formula[i] = obj.value
            }
          }
        } else {
          if (arr[i] !== '') {
            formula[i] = arr[i];
          }
        }
      }

      for (let j = 0; j < formula.length; j++) {
        if (this.isOperator(formula[j])) {
          resutl = this.operator[(formula[j])](parseFloat(formula[(j - 1)]), parseFloat(formula[(j + 1)]));
          formula[(j + 1)] = resutl;
          j = j + 1;
        }
      }

      var k = 0;
      if (resutl) {
        for (let obj1 of g_tableData) {
          if (obj1[l_seqId] == seqId) {
            for (let key in recordsInfo) {
              if (recordsInfo[key].entry_by_user == "T" || recordsInfo[key].entry_by_user == "R" &&
                recordsInfo[key].entry_by_user !== '') {
                k++;
                if (recordsInfo[key].column_name == equationOP) {
                  var factor;
                  var l_key = (k - 1);
                  factor = "1" + Array(+(parseInt(recordsInfo[key].decimal_digit) > 0 &&
                    parseInt(recordsInfo[key].decimal_digit) + 1)).join("0");
                  obj1[l_key] = Math.round(resutl * factor) / factor;
                }
              }
            }
          }
        }
      }
    }
    return g_tableData;
  }

  autoCalculationOfDuration(fields, column_name) {
    var datePipe = new DatePipe("en-US");
    var formula = [];
    var data_column = '';
    var FromDate;
    var ToDate;
    for (let obj of fields) {
      if (obj.auto_calculation) {
        data_column = obj.column_name;
        if ((obj.auto_calculation.indexOf(column_name)) > -1) {
          var arr = obj.auto_calculation.split("#");
          for (var i = 0; i < arr.length; i++) {
            if (!this.isOperator(arr[i]) && arr[i] !== '') {
              for (let obj1 of fields) {
                if (obj1.column_name == arr[i]) {
                  formula[i] = obj1.value;
                }
              }
            } else { }
          }
          if (formula[0] && formula[2]) {
            var diffMs = (formula[0] - formula[2]); // milliseconds
            var diffDays = Math.floor(diffMs / 86400000); // days
            var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
            var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
            obj.value = diffDays + " dy: " + diffHrs + " hr: " + diffMins + " mn";
          } else { obj.value = '' }
        }
      } else if (obj.para_desc == "From Date") {
        FromDate = obj.value;
      } else if (obj.para_desc == "To Date") {
        ToDate = obj.value;
      }
    }

    if (FromDate) {
      for (let objj of fields) {
        if (objj.para_desc === "To Date") {
          var dd = datePipe.transform(FromDate, "yyyy-MM-dd");
          objj.from_value = dd;
        }
      }
    }

    if (FromDate && ToDate) {
      FromDate = datePipe.transform(FromDate, 'dd-MM-yyyy');
      ToDate = datePipe.transform(ToDate, 'dd-MM-yyyy');
      var year = FromDate.substring(6, 10); //6 character
      var month = FromDate.substring(3, 5);
      var date = FromDate.substring(0, 2);
      var endYear = ToDate.substring(6, 10);
      var endMonth = ToDate.substring(3, 5);
      var endDate = ToDate.substring(0, 2);
      var startDate = new Date(year, month - 1, date);
      endDate = new Date(endYear, endMonth - 1, endDate);
      if (startDate > endDate) {
        let alertVal = this.globalObjects.showAlert("To date should be greater than From date");
        alertVal.present();
        for (let objj of fields) {
          if (objj.para_desc === "To Date") {
            objj.value = '';
            ToDate = null;
          }
        }
      }
    }
    return fields;
  }


  setColumnDependentVal(fields, url, l_appSeqNo, column_name) {
    for (let obj of fields) {
      if (obj.column_validate) {
        var column_validate = obj.column_validate.split("#");
        var column_validateValue = column_validate
        for (let obj2 of fields) {
          if (column_validate.indexOf(obj2.column_name) > -1) {
            if (obj2.codeOfValue) {
              column_validateValue[column_validate.indexOf(obj2.column_name)] = obj2.codeOfValue;
            } else {
              column_validateValue[column_validate.indexOf(obj2.column_name)] = obj2.value;
            }
          }
        }
        if (column_name == obj.column_name) {
          this.http.get(url + 'validateValue?SeqNo=' + l_appSeqNo + "&colSLNO=" + obj.slno + "&valueToValidate=" + encodeURIComponent(column_validateValue))
            .subscribe(res => {
              var data: any = res
              var splitVal = data.validatedMsg.split("#");
              if (splitVal[0] == "T") {
              } else if (splitVal[0] == "F") {
                let alertVal = this.globalObjects.showAlert(splitVal[1]);
                alertVal.present();
                obj.value = "";
              }
            })
        }
      }
    }
  }

  setselfDependantRowValue(url, column_name, l_appSeqNo, value, fields) {
    return new Promise((resolve, reject) => {
      if (value) {
        this.http.get(url + 'selfDependantRowValue?forWhichcolmn=' + column_name + '&uniquKey=' + l_appSeqNo + '&whereClauseValue=' + encodeURIComponent(value))
          .subscribe(obj => {
            var data: any = [];
            data = JSON.parse(JSON.stringify(obj));
            if (data.message) {
              // this.globalObjects.displayCordovaToast(data.message);
            }
            resolve(data.listDependentValue);
          }, (err) => {
            reject(err)
          })
      }
    })
  }

  searchByText(g_fields, column_name, textValue, url, l_appSeqNo, listOfEntry, table_desc) {
    return new Promise(function (resolve, reject) {
      for (let obj of g_fields) {
        if (obj.dependent_row == column_name && textValue) {
          if (obj.item_help_property == 'L') {
            obj.dependent_row_logic = textValue;
            obj.value = "";
            obj.codeOfValue = "";
          } else {
            g_fields = this.setDependantRowValue(obj.column_name, textValue, l_appSeqNo, column_name, "", g_fields, url, table_desc).then(fields => {
              g_fields = fields;
              resolve(g_fields)
            })
          }
        } else {
          if (obj.dependent_row) {
            if (obj.dependent_row.indexOf("#") > -1 && obj.dependent_row.indexOf(column_name) > -1) {
              var whereClauseValue = obj.dependent_row;
              var arr = obj.dependent_row.split('#');

              for (let data of g_fields) {
                if (arr.indexOf(data.column_name) > -1) {
                  if (data.codeOfValue) {
                    whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                  } else {
                    whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                  }
                }
              }
              g_fields = this.setDependantRowValue(obj.column_name, textValue, l_appSeqNo, column_name, "", g_fields, url, table_desc).then(fields => {
                g_fields = fields;
                resolve(g_fields)
              })
            }
          }
        }
      }
    })
  }

  takePhoto(column_name, flag) {
    return new Promise((resolve, reject) => {
      var sourceType: any;
      if (flag == "PHOTOLIBRARY") {
        sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
      } else {
        sourceType = this.camera.PictureSourceType.CAMERA;
      }
      const options: CameraOptions = {
        quality: 50,
        sourceType: sourceType,
        destinationType: this.camera.DestinationType.DATA_URL,
        encodingType: this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        targetWidth: 450,
        targetHeight: 450,
        saveToPhotoAlbum: false,
        correctOrientation: true
      };
      this.camera.getPicture(options).then(
        imageData => {
          resolve(imageData);
        })
    })
  }

  takeVideo(column_name, column_size, fields) {
    return new Promise((resolve, reject) => {
      if (!column_size) {
        column_size = 30;
      }
      let directoryPath="";
      let platformVal=this.globalObjects.getPlatformValue();
      if(platformVal){
        if(platformVal=='ios'){
          directoryPath=this.file.documentsDirectory;
        }else{
          directoryPath=this.file.externalRootDirectory;
        }
      }else{
        directoryPath=this.file.externalRootDirectory;
      }
      let options: CaptureVideoOptions = {
        limit: 1,
        quality: 0,
        duration: column_size
      }
      this.mediaCapture.captureVideo(options).then((res: MediaFile[]) => {
        let capturedFile = res[0];
        let fileName = capturedFile.name;
        let dir = capturedFile['localURL'].split('/');
        dir.pop();
        let fromDirectory = dir.join('/');
        let toDirectory = directoryPath + "DAV5";
        this.file.createDir(directoryPath, "DAV5", false).then(result => {
          this.moveFiles(fromDirectory, fileName, toDirectory, fileName, column_name, fields);
        }, (err) => {
          this.moveFiles(fromDirectory, fileName, toDirectory, fileName, column_name, fields);
        });
      })
    })
  }
  moveFiles(path, fileName, newPath, newFileName, column_name, fields) {
    var pathval = newPath + "/";
    this.file.moveFile(path, fileName, newPath, newFileName).then(result => {
      this.setVideoData(pathval, fileName, column_name, fields);
    }, (err) => {
    });
  }

  setVideoData(pathval, fileName, column_name, fields) {
    this.file.readAsDataURL(pathval, fileName).then(result => {
      for (let obj of fields) {
        if (obj.column_name == column_name) {
          obj.value = result;
        }
        if (obj.dependent_row == column_name) { //Check for control dependency 
          obj.excel_upload = 0;
          obj.value = "";
          for (let obj1 of fields) {
            if (obj.column_name == obj1.dependent_row) {
              obj1.excel_upload = 1; /*variable "excel_upload" is used from web service generated JSON,to disable dependent controls */
              obj1.value = "";
            }
          }
        } else { }
      }
    }, (err) => {
    });
  }

  setSlno(no) {
    this.slno = no;
  }
  getSlno() {
    this.slno = this.slno + 1;
    return this.slno;
  }

  operator: any = {
    '+': function (a, b) { return a + b },
    '-': function (a, b) { return a - b },
    '*': function (a, b) { return a * b },
    '/': function (a, b) { return a / b },
    '<': function (a, b) { return a < b },
    '>': function (a, b) { return a > b },
    '<=': function (a, b) { return a <= b },
    '>=': function (a, b) { return a >= b }
  };

  process = {
    T: function () { return "PAINTED" },
    Z: function () { return "RFG INSPECTION" },
    E: function () { return "RE-PUNCHING" },
    C: function () { return "CUTTING" },
    P: function () { return "PUNCHING" },
    N: function () { return "NOTCHING" },
    G: function () { return "GALVANIZING" },
    H: function () { return "HEEL GRINDING" },
    D: function () { return "DRILLING" },
    W: function () { return "WELDING" },
    B: function () { return "BEND" },
    A: function () { return "ANGLE FABRICATION" },
    R: function () { return "PLATE FABRICATION" },
    S: function () { return "STAMPING" },
    0: function () { return "BUNDLING" },
    L: function () { return "H/O TO GALVANISING" },
    F: function () { return "CUTTING, PUNCHING STAMPING" },
    M: function () { return "PROTO FAB.ASSEBLING & DIS." },
    Y: function () { return "CLEAT FABRICATION" },
    I: function () { return "GAS CUTTING" },
    O: function () { return "SPECIAL GALVANISING COATING" },
    Q: function () { return "PUNCHING,STAMPING" },
    K: function () { return "SHEARING" },
  }

  getProcessMsg(process_code) {
    var process_code_status = process_code.split("#")[0];
    var process_code1 = process_code.split("#")[1];
    var msg;
    if (process_code_status === 'F') {
      var arr = process_code1.split("");
      for (var i = 0; i < arr.length; i++) {
        if (msg) {
          msg = msg + ", '" + this.process[(arr[i])]() + "' ";
        } else {
          msg = "'" + this.process[(arr[i])]() + "'";
        }
      }
      msg = msg.replace(/.$/, "") + " process are not done for this job Card"
    }
    return msg;
  }

  getCheckMarkNoMsg(checkMarkno) {
    var checkMarkno_status = checkMarkno.split("#")[0];
    var checkMarknoMsg = checkMarkno.split("#")[1];
    var msg;
    if (checkMarkno_status === 'F') {
      msg = checkMarknoMsg;
    }
    return msg;

  }

  pad(sysTime) {
    return (sysTime < 10 ? "0" : "") + sysTime;
  }
  getLatLongTimestamp() {
    return new Promise((resolve, reject) => {
      let l_object: any = { latitude: '', longitude: '', timestamp: '', location: "" };

      this.geoLocation.getCurrentPosition().then(pos => {
        l_object.latitude = pos.coords.latitude;
        l_object.longitude = pos.coords.longitude;
        let timeS: Date = new Date(pos.timestamp);
        let hours = timeS.getHours(),
          minutes = timeS.getMinutes(),
          seconds = timeS.getSeconds(),
          months = timeS.getMonth() + 1,
          day = timeS.getDate(),
          year = timeS.getFullYear() % 100;
        let l_dateTime = this.pad(months) + "-" +
          this.pad(day) + "-" +
          this.pad(year) + " " +
          this.pad(hours) + ":" +
          this.pad(minutes) + ":" +
          this.pad(seconds);
        l_object.timestamp = l_dateTime.toString();
        resolve(l_object);
      }, err => {
        resolve(l_object);
      });
    })
  }


  scanBarcode(g_fields, column_name, url, l_appSeqNo, listOfEntry, table_desc) {
    return new Promise((resolve, reject) => {
      var option = {
        preferFrontCamera: false,
        prompt: 'Please Scan Your Code!!!'
      }
      this.barcode.scan(option).then((barcodeData) => {
        var arr = [];
        if (listOfEntry) {
          listOfEntry.forEach(function (obj) {
            obj.forEach(function (obj1) {
              if (obj1.column_type == "BARCODE") {
                if (obj1.value) {
                  arr.push(obj1.value);
                }
              }
            })
          })
        }
        if (arr.indexOf(barcodeData.text) < 0) {
          for (let obj of g_fields) {
            if (obj.column_name == column_name) {
              obj.value = barcodeData.text;
            }
            if (obj.column_name == 'BUNDLE_STATUS') {
              if (obj.value != 'R') {
                obj.value = "R";
              } else {
              }
            }
            if (obj.dependent_row == column_name && barcodeData.text != null) {
              if (obj.item_help_property == 'L') {
                obj.dependent_row_logic = barcodeData.text;
                obj.value = "";
                obj.codeOfValue = "";
              } else {
                g_fields = this.setDependantRowValue(obj.column_name, whereClauseValue, l_appSeqNo, column_name, "", g_fields, url, table_desc).then(fields => {
                  g_fields = fields;
                  resolve(g_fields)
                })
              }
            } else {
              if (obj.dependent_row) {
                if (obj.dependent_row.indexOf("#") > -1 && obj.dependent_row.indexOf(column_name) > -1) {
                  var whereClauseValue = obj.dependent_row;
                  var arr1: any = []
                  arr1 = obj.dependent_row.split('#');
                  for (let data of g_fields) {
                    if (arr1.indexOf(data.column_name) > -1) {
                      if (data.codeOfValue) {
                        whereClauseValue = whereClauseValue.replace(data.column_name, data.codeOfValue);
                      } else {
                        whereClauseValue = whereClauseValue.replace(data.column_name, data.value);
                      }
                    }
                  }
                  g_fields = this.setDependantRowValue(obj.column_name, whereClauseValue, l_appSeqNo, column_name, "", g_fields, url, table_desc).then(fields => {
                    g_fields = fields;
                    resolve(g_fields)
                  })
                }
              }
            }

          }
        }
        if (arr.indexOf(barcodeData.text) > -1) {
          let alertVal = this.globalObjects.showAlert("This BARCODE(" + barcodeData.text + ") is already Scanned.");
          alertVal.present();
        }
      }, (err) => {
      })
    })
  }

  coLumnValidate(column_name, coLumnValidateFun, fields) {
    var arr = coLumnValidateFun.split("#");
    fields.forEach(function (obj) {
      if (coLumnValidateFun.indexOf(obj.column_name) > -1) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i] === obj.column_name) {
            arr[i] = obj.value;
          }
        }
      }
    })
    var result = true;
    for (let j = 0; j < arr.length; j++) {
      if (this.isOperator(arr[j])) {
        if (arr[(j - 1)] && arr[(j + 1)]) {
          result = this.operator[(arr[j])](parseFloat(arr[(j - 1)]), parseFloat(arr[(j + 1)]));
          arr[(j + 1)] = result;
          j = j + 1;
        }
      }
    }
    if (!result) {
      var arr2 = coLumnValidateFun.split("#");
      var msg = arr2[0] + " should be " + arr2[1] + " " + arr2[2]
      fields.forEach(function (obj) {
        if (arr2[0] === obj.column_name) {
          msg = msg.replace(arr2[0], obj.column_desc)
        }
        if (arr2[2] === obj.column_name) {
          msg = msg.replace(arr2[2], obj.column_desc)
        }

        if (column_name === obj.column_name) {
          obj.value = 0;
        }
      })
      fields = this.autoCalculation(column_name, fields);
      msg = msg.replace("<=", " less than or equal to ")
      msg = msg.replace(">=", " greate than or equal to ")
      msg = msg.replace("<", " less than ")
      msg = msg.replace(">", " greate than ")
      let alertVal = this.globalObjects.showAlert(msg);
      alertVal.present();
    }
    return fields;
  }

  noOfCallSE = 0;
  responseSE = false;
  setDependantRowValueSE(column_name, name, l_appSeqNo, dependent_row, type, fields, s_url, noOfCall) {
    if (this.online) {
      if (type == "offlineUpdateEntry") { } else {
        var url = s_url + 'dependantRowValue?forWhichcolmn=' + column_name + '&whereClauseValue=' + encodeURIComponent(name) + '&uniquKey=' + l_appSeqNo;
        var data: any;
        this.http.get(url).subscribe(data1 => {
          this.noOfCallSE++;
          data = data1
          if (data.value) {
            this.responseSE = true;
          }
          var temp = data.value;
          var tempCode = data.code;
          var temp1 = true
          var auto_calculation = "";
          var equationOP = "";
          for (let obj of fields) {
            if (temp1) {
              if (obj.column_name == column_name) {
                obj.value = temp;
                obj.codeOfValue = tempCode;
                temp1 = false;
                auto_calculation = obj.auto_calculation;
                equationOP = obj.equationOP;
              }
            }
          }
          fields = this.autoCalculation(column_name, fields);
          if (this.noOfCallSE == noOfCall) {
            if (!this.responseSE) {
              this.globalObjects.displayCordovaToast("Data not available for search entity...")
            }
            this.noOfCallSE = 0;
            this.responseSE = false;
          }
        }, err => {
          console.log(err);
        })
      }
    }
    return fields;
  }
  setLOVValues(fields, column_desc, column_name, item, l_appSeqNo, dependent_row, l_url, table_desc) {
    for (let obj of fields) {
      if (obj.column_desc == column_desc || obj.para_desc == column_desc) {
        if (item.name) {
          obj.value = item.name;
          obj.codeOfValue = item.code;
        } else {
          obj.value = item.code;
          obj.codeOfValue = item.code;
        }
      }
      if (obj.dependent_row) {
        if (obj.dependent_row.indexOf(column_name) > -1) {
          if (obj.item_help_property == 'L') {
            obj.dependent_row_logic = item.code;
            obj.value = "";
            obj.codeOfValue = "";
          } else {
            if (obj.item_help_property == 'AS') {
              // setDataListValue(obj.column_name, item.code, this.l_appSeqNo, this.dependent_row, this.type, this.fields, this.l_url).then(function (f) {
              //   this.fields = f;
              // });
            }
          }
        }
      }
    }
    return fields;
  }
  setmultiLOVvalue(fields, lov, column_desc) {
    return new Promise((resolve, reject) => {
      var lovCount = 0;
      for (let obj of fields) {
        if (obj.column_desc == column_desc) {
          obj.value = '';
          obj.codeOfValue = ''
          for (let obj1 of lov) {

            if (obj1.checked) {
              if (obj.value == '' || obj.value == null) {
                obj.value = obj1.name;
                obj.codeOfValue = obj1.code;
              } else {
                obj.value = obj.value + ", " + obj1.name;
                obj.codeOfValue = obj.codeOfValue + ", " + obj1.code;
              }
              lovCount = lovCount + 1;
            }
          }
          obj.itemSelected = lovCount;
        }
      }
      resolve(fields);
    })
  }

}
