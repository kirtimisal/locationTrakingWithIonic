import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
  selector: 'page-single-select-lov',
  templateUrl: 'single-select-lov.html',
})
export class SingleSelectLovPage {
  column_desc: any;
  column_name: any;
  dependent_row: any;
  dependent_row_logic: any;
  item_help_property: any
  l_lov: any;
  l_url: any;
  summaryReport: any;
  online: boolean;
  user_code: any;
  l_appSeqNo: any;
  l_data: any = {};
  fields: any;
  table_desc: any;
  selectedValue: any;
  constructor(public viewCtrl: ViewController, public http: Http, public pouchDBService: PouchDBService,
    public navCtrl: NavController, public navParams: NavParams,
    public globalObjects: GlobalObjectsProvider, public addUpdateEntryServices: AddUpdateEntryServicesProvider) {
    this.column_desc = navParams.get('paramValue').column_desc;
    this.column_name = navParams.get('paramValue').column_name;
    this.dependent_row = navParams.get('paramValue').dependent_row;
    this.dependent_row_logic = navParams.get('paramValue').dependent_row_logic;
    this.item_help_property = navParams.get('paramValue').item_help_property;
    this.user_code = navParams.get('paramValue').user_code;
    this.l_url = navParams.get('paramValue').url;
    this.l_appSeqNo = navParams.get('paramValue').appSeqNo;
    this.fields = navParams.get('paramValue').fields;
    this.online = this.globalObjects.getOnlineStatus();
    this.summaryReport = navParams.get('paramValue').summaryReport;
    this.selectedValue = navParams.get('paramValue').value;
    if (this.selectedValue) {
      this.selectedValue = this.selectedValue.split(", ");
    }
  }

  ionViewDidLoad() {
    var id;
    var url;
    if (this.dependent_row == null) {
      url = this.l_url + 'getLOVDyanamically?uniqueID=' + this.l_appSeqNo + '&forWhichColmn=' + this.column_name + "&userCode=" + this.user_code;;
      id = this.l_appSeqNo + this.column_name;
    } else {
      if (this.dependent_row_logic == "=" || this.dependent_row_logic == "null") {
        this.globalObjects.hideLoading();
        this.globalObjects.displayCordovaToast('Please select above dependent value')
      } else {
        url = this.l_url + 'getLOVDyanamically?uniqueID=' + this.l_appSeqNo + '&whereClauseValue=' +
          encodeURIComponent(this.dependent_row_logic) + '&forWhichColmn=' + this.column_name + "&userCode=" + this.user_code;
        id = this.l_appSeqNo + this.column_name + this.dependent_row_logic;
      }
    }
    if (this.summaryReport) {
      if (this.dependent_row == null) {
        url = this.l_url + 'getReportFilterLOV?uniqueID=' + this.l_appSeqNo + '&forWhichColmn=' + this.column_name + "&userCode=" + this.user_code;;
        id = this.l_appSeqNo + this.column_name;
      } else {
        if (this.dependent_row_logic == "=" || this.dependent_row_logic == "null") {
          this.globalObjects.hideLoading();
          this.globalObjects.displayCordovaToast('Please select above dependent value')
        } else {
          url = this.l_url + 'getReportFilterLOV?uniqueID=' + this.l_appSeqNo + '&whereClauseValue=' +
            this.dependent_row_logic + '&forWhichColmn=' + this.column_name + "&userCode=" + this.user_code;
          id = this.l_appSeqNo + this.column_name + this.dependent_row_logic;
        }
      }
    }

    if (this.online) {
      if (url) {
        this.globalObjects.showLoading();
        this.http.get(url).map(res => res.json()).subscribe(data => {
          this.globalObjects.hideLoading();
          this.l_lov = data.locationList
          if (this.l_lov == '') {
            this.globalObjects.displayCordovaToast("Data is not available..");
          } else {
            var l_lovToSearch = this.l_lov;
            var flagLOVCodeValue = "";
            if (this.l_lov) {
              for (let obj of this.l_lov) {
                if (obj.rowId != "") {
                  obj.code = '';
                  flagLOVCodeValue = "Empty";
                }
                if (obj.code == obj.name) {
                  flagLOVCodeValue = "Empty";
                }
                if (this.selectedValue) {
                  if (this.selectedValue.indexOf(obj.code) > -1 || this.selectedValue.indexOf(obj.name) > -1) {
                    obj.checked = true;
                  }
                }
              }

              var l_tempSortedLov = {};
              for (var i = 0; i < l_lovToSearch.length; i++) {
                let letter;
                if (l_lovToSearch[i].name) {
                  letter = l_lovToSearch[i].name.toUpperCase().charAt(0);
                } else {
                  if (l_lovToSearch[i].code) {
                    letter = l_lovToSearch[i].code.toUpperCase().charAt(0);
                  }
                }
                if (l_tempSortedLov[letter] == undefined) {
                  l_tempSortedLov[letter] = []
                }
                l_tempSortedLov[letter].push(l_lovToSearch[i]);
              }
            }
            this.l_data.sorted_users = l_tempSortedLov;
            this.l_data.lov = this.l_lov;
            this.l_data.flagLOVCodeValue = flagLOVCodeValue;
            this.l_data.lovHeading = data.lovHeading;
          }
        }, err => {
          this.globalObjects.hideLoading();
        });
      }
    } else {
      return new Promise((resolve, reject) => {
        this.pouchDBService.getObject("lov" + id).then((resdata) => {
          var data: any = resdata;
          this.l_lov = data.lov;
          if (this.l_lov == '') {
            let alertVal = this.globalObjects.showAlert("Data is not available..");
            alertVal.present();
          } else {
            var l_lovToSearch = this.l_lov;
            var flagLOVCodeValue = "";
            for (let obj of this.l_lov) {
              if (obj.rowId != "") {
                obj.code = '';
                flagLOVCodeValue = "Empty";
              }
              if (obj.code == obj.name) {
                flagLOVCodeValue = "Empty";
              }
            }
            var l_tempSortedLov = {};
            for (var i = 0; i < l_lovToSearch.length; i++) {
              let letter;
              if (l_lovToSearch[i].name) {
                letter = l_lovToSearch[i].name.toUpperCase().charAt(0);
              } else {
                if (l_lovToSearch[i].code) {
                  letter = l_lovToSearch[i].code.toUpperCase().charAt(0);
                }
              }
              if (l_tempSortedLov[letter] == undefined) {
                l_tempSortedLov[letter] = []
              }
              l_tempSortedLov[letter].push(l_lovToSearch[i]);
            }
            this.l_data.sorted_users = l_tempSortedLov;
            this.l_data.lov = this.l_lov;
            this.l_data.flagLOVCodeValue = flagLOVCodeValue;
          }
          this.globalObjects.hideLoading();
          resolve(this.l_data);
        }, (err) => {
          this.globalObjects.hideLoading();
          reject('error')
        })
      })
    }
  }

  setLOVValues(item) {
    this.fields = this.addUpdateEntryServices.setLOVValues(this.fields, this.column_desc, this.column_name, item, this.l_appSeqNo, this.dependent_row, this.l_url, this.table_desc);
    this.addUpdateEntryServices.setDependantRowValue(this.column_name, item.code, this.l_appSeqNo, this.dependent_row, "",
      this.fields, this.l_url, this.table_desc).then((data) => {
        this.fields = JSON.parse(JSON.stringify(data));
        this.viewCtrl.dismiss(this.fields);
      })
  }

  closeLov() {
    this.viewCtrl.dismiss(this.fields);
  }

  setmultiLOVvalue(lov) {
    this.addUpdateEntryServices.setmultiLOVvalue(this.fields, lov, this.column_desc).then(data => {
      this.fields = JSON.parse(JSON.stringify(data));
      this.viewCtrl.dismiss(this.fields);
    })
  }
}
