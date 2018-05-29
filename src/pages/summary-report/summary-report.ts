import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
// import { ReportAnalysisPage } from '../report-analysis/report-analysis';
import { DatePicker } from '@ionic-native/date-picker';
// import { SingleSelectLovPage } from '../single-select-lov/single-select-lov';

@IonicPage({
  defaultHistory: ['HomePage']
})
@Component({
  selector: 'page-summary-report',
  templateUrl: 'summary-report.html',
})
export class SummaryReportPage {
  search:boolean=false;
  sp_obj: any; login_params: any; firstScreen: string; showSummaryValueFlag: any; showSummaryTabFlag: any;
  url: any; graphTab: any; fields: any; reportSeqNo: any; isReadonly: boolean = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, private datePicker: DatePicker,
    private addUpdateEntryServices: AddUpdateEntryServicesProvider, public globalObjects: GlobalObjectsProvider,
    private http: Http) {
    this.sp_obj = this.globalObjects.getLocallData("tabParam");
    this.login_params = this.globalObjects.getLocallData("userDetails");
    this.firstScreen = this.sp_obj.firstScreen;
    this.url = this.globalObjects.getScopeUrl();
  }
  
  ionViewDidLoad() {
    if (this.sp_obj.firstScreen == 1 || this.sp_obj.firstScreen == "T") {
      if (this.sp_obj.firstScreen == "T") {
        this.showSummaryValueFlag = 1;
      }
      this.showSummaryTabFlag = 1;
    }
    var l_url = "";
    if (this.firstScreen == 'G') {
      l_url = this.url + 'graphTabList?portletId=' + this.globalObjects.getLocallData("portlet_Id") + '&seqNo=' + this.sp_obj.seqNo + '&userCode=' + this.login_params.user_code;
    } else {
      l_url = this.url + 'tableTabList?portletId=' + this.globalObjects.getLocallData("portlet_Id") + '&seqNo=' + this.sp_obj.seqNo + '&userCode=' + this.login_params.user_code;
    }
    this.globalObjects.showLoading();
    this.http.get(l_url).map(res => res.json()).subscribe(data => {
      this.graphTab = data.tabList;

      this.globalObjects.hideLoading();
      for (let obj of this.graphTab) {
        obj.isProcessing = false;
        var lastUpdateVal = obj.lastupdate;
        if (obj.lastupdate) {
          if ((obj.lastupdate).indexOf("#")) {
            var splitlastUpdate = lastUpdateVal.split("#");
            if (splitlastUpdate[0] == "R") {
              obj.colorVal = "red";
            } else {
              obj.colorVal = "none";
            }
            obj.lastupdate = splitlastUpdate[1];
          }
        }
      }
    }, err => { this.globalObjects.hideLoading(); })

  }
  refreshSummaryValue(seq_no, reportingType) {
    this.globalObjects.showLoading();
    this.graphTab.forEach(function (obj) {
      if (obj.seq_no == seq_no) {
        obj.isProcessing = true;
      }
    })
    var l_url = this.url + 'CallLastUpdateProcedure?userCode=' + this.login_params.user_code +
      '&seqId=' + seq_no + '&entityCode=' + this.login_params.entity_code + '&divCode=' +
      this.login_params.division_data + '&accYear=' + this.login_params.acc_year;
    this.http.get(l_url).map(res => res.json()).subscribe(data => {
      this.globalObjects.hideLoading();
      this.globalObjects.displayCordovaToast(data.status);
      this.ionViewDidLoad();
    }, err => { })

  }
  closeSlide(seq_no, status) {
    this.graphTab.forEach((item) => {
      if (item.seq_no == seq_no) {
        item.status = !item.status;
      }
    })
  }
  openSlide(seq_no, status) {
    if (!status) {
      var l_url = this.url + "reportFilterForm?userCode=" + this.login_params.user_code + '&seqNo=' + seq_no;
      this.http.get(l_url).map(res => res.json()).subscribe(data => {
        if (data.recordsInfo) {
          this.addUpdateEntryServices.setDataCommon(data.recordsInfo, "", "", "", "", "").then(fieldsVal => {
            this.fields = fieldsVal;
            this.reportSeqNo = data.seqNo;
            var count = 1;
            for (let obj of this.fields) {
              obj.column_name = "col" + count;
              count++;
              if (obj.para_column == "VALUE_FORMAT") {
                obj.hideValueFormat = "true";
              }
            }
            for (let item of this.graphTab) {
              if (item.seq_no == seq_no) {
                item.status = !item.status;
              } else {
                if (!status) {
                  item.status = status;
                }
              }
            }
          });
        } else {
          this.globalObjects.displayCordovaToast("Data Not Available");
        }
      }, err => { })

    } else {
      for (let item of this.graphTab) {
        if (item.seq_no == seq_no) {
          item.status = !item.status;
        }
      }
    }
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
    paramValue.user_code = this.login_params.user_code;
    paramValue.appSeqNo = this.reportSeqNo;
    paramValue.fields = this.fields;
    paramValue.value = value;
    paramValue.summaryReport = true;
    let SingleSelectLovModal = this.modalCtrl.create('SingleSelectLovPage', { paramValue: paramValue });
    SingleSelectLovModal.onDidDismiss(fieldsData => {
      this.dependent_nullable_logic(name, column_name, this.fields, this.url);
    });
    SingleSelectLovModal.present();
  }
  setLOVValues(item) {
    for (let obj of this.fields) {
      if (obj.para_desc == item.para_desc) {
        obj.value = "";
        obj.codeOfValue = "";
      }
      if (obj.dependent_row) {
        if (obj.dependent_row.indexOf(item.para_column) > -1) {
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
            dateVal = this.globalObjects.formatDate(date, 'dd-MM-yyyy');
            items.value = dateVal;
          }
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }
  openReportAnalysis(seq_no, reportingType, paginationFlag) {
    var l_graphObj: any = [];
    l_graphObj.seq_no = seq_no;
    l_graphObj.reportingType = reportingType;
    l_graphObj.firstScreen = this.sp_obj.firstScreen;
    this.sp_obj.filteredParam = {};
    l_graphObj.filteredParam = this.sp_obj.filteredParam;
    l_graphObj.paginationFlag = paginationFlag;
    l_graphObj.showDataInReportHead = [];
    l_graphObj.valueFormat = [];
    var valueFlag: any = [];
    var temVal = "";
    var valueToSend: any = {};
    var dataTemp = this.globalObjects.getLocallData("valueFormat");
    if (dataTemp) {
      for (let itemVal of dataTemp) {
        if (itemVal.seqId == seq_no) {
          temVal = itemVal.selectedFormat;
        }
      }
    }
    if (this.sp_obj.firstScreen == "CV") {
      // $state.go('reportCardView', {
      //     obj: l_graphObj
      // });
    } else {
      this.globalObjects.showLoading();
      var l_url1 = this.url + "reportFilterForm?userCode=" + this.login_params.user_code + '&seqNo=' + seq_no;
      this.http.get(l_url1).map(res => res.json()).subscribe(data => {
        if (data.recordsInfo) {
          for (let obj of data.recordsInfo) {
            if (obj.value && obj.showDataInReportHead == 'T') {
              valueFlag.push({ 'value': obj.value });
            }
            if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
              if (obj.value) {
                valueToSend[obj.para_column] = obj.value;
              }
            }
            if (obj.para_column == 'VALUE_FORMAT') {
              if (temVal == "") {
                temVal = obj.value;
              }
              l_graphObj.valueFormat.push({ 'para_desc': obj.para_desc, 'value': temVal, 'dropdownVal': obj.dropdownVal });
            }
          }
          l_graphObj.showDataInReportHead = JSON.parse(JSON.stringify(valueFlag));
        }
        for (let item of this.graphTab) {
          if (item.seq_no == seq_no) {
            item.status = false;
          }
        }

        this.navCtrl.push('ReportAnalysisPage', { obj: l_graphObj, seq_no: seq_no, valueFormat: temVal, valueToSend: valueToSend });
      }, err => { })
    }
  }
  refreshSummaryValuePara(seq_no, reportingType, fields) {
    this.globalObjects.showLoading();
    var key;
    var value;
    var jsonList = {};
    var setYear;
    for (let obj of fields) {

      if (obj.item_help_property == "R") {
        if (obj.value == true) {
          obj.value == this.globalObjects.getDate(obj.para_desc);
          setYear = this.globalObjects.getDate(obj.para_desc);
        }
      }
      if (obj.item_help_property == "L") {
        if (obj.codeOfValue) {
          obj.value = obj.codeOfValue;
        }
      }
      for (let keyval in obj) {
        if (keyval == "para_column") {
          key = obj[keyval]
        }
        if (keyval == "value") {
          value = obj[keyval]
        }
      }
      if (obj.item_help_property == "R") {
        value = setYear;
      }
      jsonList[key] = value;
    }
    this.sp_obj.filteredParam = fields;
    // console.log('filterRefreshReportData-----' + JSON.stringify(this.sp_obj.filteredParam));
    var l_url = this.url + "filterRefreshReportData?userCode=" + this.login_params.user_code +
      "&seqId=" + seq_no + "&entityCode=" + this.login_params.entity_code + "&divCode=" +
      this.login_params.division_data + "&accYear=" + this.login_params.acc_year + "&JSON=" + JSON.stringify(jsonList);

    this.http.get(l_url).map(res => res.json()).subscribe(data => {
      this.globalObjects.hideLoading();
      for (let obj of this.graphTab) {
        if (obj.seq_no == seq_no) {
          obj.isProcessing = false;
        }
      }
      this.globalObjects.displayCordovaToast(data.status);
      this.ionViewDidLoad();
    }, err => {
      this.globalObjects.hideLoading();
      this.globalObjects.displayCordovaToast('Report Not Updated');
      for (let obj of this.graphTab) {
        if (obj.seq_no == seq_no) {
          obj.isProcessing = false;
        }
      }
    })
  }

  toggleRadio(key1, para_column, dependent_row) {
    this.fields.forEach(function (obj) {
      if (obj.item_help_property == "R") {
        if (obj.para_desc == key1) {
          obj.value = true;
        } else {
          if (obj.para_column == para_column)
            obj.value = false;
        }
      }
      if (obj.item_help_property == dependent_row) {
        obj.disable = true;
      }
    })
  }

  dependent_nullable_logic(value, column_name, dependent_value, flag) {
    this.addUpdateEntryServices.dependent_nullable_logic(value, column_name, this.fields, this.url, this.sp_obj.seqNo, dependent_value, flag)
      .then((data) => {
        this.fields = data;
        if (flag == 'search') {
        } else {
          this.addUpdateEntryServices.setColumnDependentVal(this.fields, this.url, this.sp_obj.seqNo, column_name);
        }
      });
  }
}
