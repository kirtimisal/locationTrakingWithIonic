import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { DataServicesProvider } from '../../providers/data-services/data-services';
// import { HomePage } from '../home/home';
// import { OfflineRefreshFormPage } from '../offline-refresh-form/offline-refresh-form';

@IonicPage()
@Component({
  selector: 'page-offline-refresh-tab',
  templateUrl: 'offline-refresh-tab.html',
})
export class OfflineRefreshTabPage {
  online: boolean;
  offlineData: any;
  userDetails;
  base_url;
  l_appType
  table_desc: any;
  lovs: any = [];
  dependentlovs: any = [];
  defaultPopulatedData: any = [];
  formData: any = [];
  seqNo;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public globalObjectServices: GlobalObjectsProvider, private modalCtrl: ModalController,
    public http: Http, public dataServices: DataServicesProvider) {
  }

  ionViewDidLoad() {
    this.userDetails = this.globalObjectServices.getLocallData('userDetails');
    this.l_appType = this.globalObjectServices.getLocallData('apptype');
    this.base_url = this.globalObjectServices.getScopeUrl();
    this.online = this.globalObjectServices.getOnlineStatus();
    if (this.online) {
      this.globalObjectServices.showLoading();
      var url = this.globalObjectServices.getScopeUrl() + 'tableDetailForOffline?appType=' + this.l_appType + '&userCode=' + this.userDetails.user_code;
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.offlineData = data.table_Detail;
        this.dataServices.setOfflineDashbordData(data.table_Detail, data.view_mode, this.l_appType);
        this.globalObjectServices.hideLoading();
      }, err => {
        this.globalObjectServices.hideLoading();
        this.globalObjectServices.displayErrorMessage(status);
      })
    } else {
      this.globalObjectServices.displayCordovaToast('Network is not available Try again...');
      this.navCtrl.setRoot('HomePage');
    }
  }

  pageDetails(item) {
    this.globalObjectServices.showLoading();
    this.table_desc = item.table_desc;
    this.lovs = [];
    this.dependentlovs = [];
    this.defaultPopulatedData = [];
    this.formData = [];
    var isLOV = false;
    this.seqNo = item.seqNo;
    var firstScreen = item.firstScreen;
    let l_url;
    let url;
    if (firstScreen == "E" || firstScreen == "C") {
      l_url = this.base_url + 'addEntryForm?seqNo=' + this.seqNo + '&userCode=' + this.userDetails.user_code + '&searchText=' + '&accCode=' + this.userDetails.acc_code;
      this.http.get(l_url).map(res => res.json()).subscribe(data => {
        this.globalObjectServices.hideLoading();
        var formData: any = {};
        formData.data = data;
        formData.seqNo = this.seqNo;
        formData.table_desc = this.table_desc;
        this.formData.push(formData);
        for (let obj of data.recordsInfo) {
          if (obj.item_help_property == "L") {
            if (obj.dependent_row == null) {
              var url = this.globalObjectServices.getScopeUrl() + 'getLOVDyanamically?uniqueID=' + this.seqNo +
                '&forWhichColmn=' + obj.column_name + "&userCode=" + this.userDetails.user_code;
              let temp: any = {};
              temp.lov = "";
              temp.url = url;
              temp.column_desc = obj.column_desc;
              temp.column_name = obj.column_name;
              temp.id = this.seqNo + obj.column_name;
              this.lovs.push(temp);
              isLOV = true;
            } else {
              let temp: any = {};
              temp.lov = '';
              temp.url = this.globalObjectServices.getScopeUrl() + 'getLOVDyanamically?uniqueID=' + this.seqNo + '&whereClauseValue=' + "&userCode=" + this.userDetails.user_code + '&whereClauseValue=';
              temp.column_desc = obj.column_desc;
              temp.column_name = obj.column_name;
              temp.dependent_row = obj.dependent_row;
              temp.dependent_row_logic = obj.dependent_row_logic;
              for (let obj11 of data.recordsInfo) {
                if (obj.dependent_row == obj11.column_name) {
                  if (obj11.item_help_property == "H") {
                    var dropdownVal = obj11.dropdownVal.split("#");
                    let temp11 = [];
                    for (let element of dropdownVal) {
                      let temp2 = element.split("~");
                      temp11.push({
                        name: temp2[1],
                        code: temp2[0]
                      });
                    }
                    temp.dependentLov = temp11;
                  } else {
                    temp.dependentLov = "";
                  }
                }
              }
              temp.id = this.seqNo + obj.column_name;
              this.dependentlovs.push(temp);
            }
            isLOV = true;
          }
        }
        if (isLOV) {
          let storeModal = this.modalCtrl.create('OfflineRefreshFormPage', { formData: this.formData, lovs: this.lovs, dependentLov: this.dependentlovs, defaultPopulateData: this.defaultPopulatedData });
          storeModal.present();
        } else {
          this.storeForm(this.seqNo, data);
        }
      }, err => {
        this.globalObjectServices.displayErrorMessage(err);
      })
    }

    if (firstScreen == "O" || firstScreen == "PO") {
      l_url = this.base_url + 'addEntryForm?seqNo=' + ((parseInt(this.seqNo)) + 0.1) + '&userCode=' +
        this.userDetails.user_code + '&accCode=' + this.userDetails.acc_code + '&searchText=';
      this.http.get(l_url).map(res => res.json()).subscribe(data => {
        this.globalObjectServices.hideLoading();
        var formData: any = {};
        formData.data = data;
        formData.seqNo = ((parseInt(this.seqNo)) + 0.1);
        formData.table_desc = this.table_desc + " " + 1;
        this.formData.push(formData);
        for (let obj of data.recordsInfo) {
          if (obj.dependent_row) {
            for (let obj1 of data.recordsInfo) {
              if (obj1.column_name == obj.dependent_row) {
                if (obj.dependent_row_logic == "=") {
                  if (obj1.codeOfValue != null) {
                    obj.dependent_row_logic = obj1.codeOfValue;
                  } else {
                    if (obj1.value != null) {
                      obj.dependent_row_logic = obj1.value;
                    } else {
                      obj.dependent_row_logic = "=";
                    }
                  }
                }
              }
            }
          }

          if (obj.item_help_property == "L" || obj.item_help_property == "M") {
            if (obj.dependent_row == null) {
              url = this.base_url + 'getLOVDyanamically?uniqueID=' + ((parseInt(this.seqNo)) + 0.1) +
                '&forWhichColmn=' + obj.column_name + "&userCode=" + this.userDetails.user_code;
              let temp: any = {};
              temp.lov = "";
              temp.url = url;
              temp.column_desc = obj.column_desc;
              temp.column_name = obj.column_name;
              temp.id = ((parseInt(this.seqNo)) + 0.1) + obj.column_name
              this.lovs.push(temp);
              if (obj.session_column_flag == 'P') {
                temp.seqNo = ((parseInt(this.seqNo)) + 0.1);
                temp.dependentLov = "";
                this.defaultPopulatedData.push(temp);
              }
              isLOV = true;
            } else {
              if (obj.dependent_row_logic && obj.dependent_row_logic !== '=' && !(obj.dependent_row_logic.indexOf('#') > -1)) {
                url = this.base_url + 'getLOVDyanamically?uniqueID=' + ((parseInt(this.seqNo)) + 0.1) +
                  '&forWhichColmn=' + obj.column_name + '&whereClauseValue=' + obj.dependent_row_logic + "&userCode=" + this.userDetails.user_code;
                let temp: any = {};
                temp.lov = "";
                temp.url = url;
                temp.column_desc = obj.column_desc;
                temp.column_name = obj.column_name;
                temp.id = ((parseInt(this.seqNo)) + 0.1) + obj.column_name + obj.dependent_row_logic;
                this.lovs.push(temp);
                if (obj.session_column_flag == 'P') {
                  temp.seqNo = ((parseInt(this.seqNo)) + 0.1);
                  temp.dependentLov = "";
                  this.defaultPopulatedData.push(temp);
                }
                isLOV = true;
              } else {
                let temp: any = {};
                temp.lov = "";
                temp.url = this.base_url + 'getLOVDyanamically?uniqueID=' + ((parseInt(this.seqNo)) + 0.1) + "&userCode=" + this.userDetails.user_code +
                  '&whereClauseValue=';
                temp.column_desc = obj.column_desc;
                temp.column_name = obj.column_name;
                temp.dependent_row = obj.dependent_row;
                temp.dependent_row_logic = obj.dependent_row_logic;
                for (let obj11 of data.recordsInfo) {
                  if (obj.dependent_row == obj11.column_name) {
                    if (obj11.item_help_property == "H") {
                      var dropdownVal = obj11.dropdownVal.split("#");
                      let temp11 = [];
                      for (let element of dropdownVal) {
                        let temp2 = element.split("~");
                        temp11.push({
                          name: temp2[1],
                          code: temp2[0]
                        });
                      }
                      temp.dependentLov = temp11;
                    } else {
                      temp.dependentLov = "";
                    }
                  }
                }
                temp.id = ((parseInt(this.seqNo)) + 0.1) + obj.column_name;
                if (obj.session_column_flag != 'P') {
                  this.dependentlovs.push(temp);
                } else {
                  temp.seqNo = ((parseInt(this.seqNo)) + 0.1);
                  this.defaultPopulatedData.push(temp);
                }
              }
            }
          }
        }
        l_url = this.base_url + 'addEntryForm?seqNo=' + ((parseInt(this.seqNo)) + 0.2) + '&userCode=' +
          this.userDetails.user_code + '&searchText=' + '&accCode=' + this.userDetails.acc_code;
        this.http.get(l_url).map(res => res.json()).subscribe(data => {
          this.globalObjectServices.hideLoading();
          var formData: any = {};
          formData.data = data;
          formData.seqNo = ((parseInt(this.seqNo)) + 0.2);
          formData.table_desc = this.table_desc + " " + 2;
          this.formData.push(formData);
          for (let obj of data.recordsInfo) {
            if (obj.item_help_property == "L") {
              if (obj.dependent_row == null) {
                var url = this.base_url + 'getLOVDyanamically?uniqueID=' + ((parseInt(this.seqNo)) + 0.2) + "&userCode=" + this.userDetails.user_code +
                  '&forWhichColmn=' + obj.column_name;
                let temp: any = {};
                temp.lov = "";
                temp.url = url;
                temp.column_desc = obj.column_desc;
                temp.column_name = obj.column_name;
                temp.id = ((parseInt(this.seqNo)) + 0.2) + obj.column_name
                this.lovs.push(temp);
                isLOV = true;
              } else {
                let temp: any = {};
                temp.lov = "";
                temp.url = this.base_url + 'getLOVDyanamically?uniqueID=' + ((parseInt(this.seqNo)) + 0.2) + "&userCode=" + this.userDetails.user_code +
                  '&whereClauseValue=';
                temp.column_desc = obj.column_desc;
                temp.column_name = obj.column_name;
                temp.dependent_row = obj.dependent_row;
                temp.dependent_row_logic = obj.dependent_row_logic;
                for (let obj11 of data.recordsInfo) {
                  if (obj.dependent_row == obj11.column_name) {
                    if (obj11.item_help_property == "H") {
                      var dropdownVal = obj11.dropdownVal.split("#");
                      let temp11 = [];
                      for (let element of dropdownVal) {
                        let temp2 = element.split("~");
                        temp11.push({
                          name: temp2[1],
                          code: temp2[0]
                        });
                      }

                      temp.dependentLov = temp11;
                    } else {
                      temp.dependentLov = "";
                    }
                  }
                }
                temp.id = ((parseInt(this.seqNo)) + 0.2) + obj.column_name;
                this.dependentlovs.push(temp);
              }
            }
          }
          if (isLOV) {
            let storeModal = this.modalCtrl.create('OfflineRefreshFormPage', { formData: this.formData, lovs: this.lovs, dependentLov: this.dependentlovs, defaultPopulateData: this.defaultPopulatedData });
            storeModal.present();
          } else {
            for (let obj of this.formData) {
              this.storeForm(obj.seqNo, obj.data);
            }
          }
        }, err => {
          this.globalObjectServices.displayErrorMessage(err)
        })
      }, err => {
        this.globalObjectServices.displayErrorMessage(err)
      })
    }
  }

  storeForm(seqNo, formData) {
    this.dataServices.setOfflineForm(seqNo, formData).then(data => {
      this.globalObjectServices.displayCordovaToast('Form saved successfully...');
    }, err => { });

  }
  lov: any;
  storeLov(item) {
    this.http.get(item.url).map(res => res.json()).subscribe(lovData => {
      this.lov = lovData.locationList;
      for (let data of this.lovs) {
        if (data.column_desc == item.column_desc) {
          data.lov = this.lov;
          for (let data1 of this.dependentlovs) {
            if (data1.dependent_row == item.column_name) {
              data1.dependentLov = this.lov;
            }
          }
          for (let data1 of this.defaultPopulatedData) {
            if (data1.column_name == item.column_name) {
              data1.dependentLov = this.lov;
            }
          }
        }
      }
      this.dataServices.storeLOV(this.lov, item.id).then(data => {
        this.globalObjectServices.displayCordovaToast('Data saved successfully...')
      }, err => { })
    }, err => {
      this.globalObjectServices.displayErrorMessage(status)
    })
  }

  storeDefaultPopulatedData(item, value) {
    var seqNo = (item.seqNo + 0.1).toFixed(1);
    var url = this.base_url + 'addEntryForm?seqNo=' + seqNo + '&userCode=' +
      this.userDetails.user_code + '&accCode=' + this.userDetails.acc_code + '&searchText=' + value;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.dataServices.setOfflineDefaultPopulatedData(seqNo, data, value).then(data => {
        this.globalObjectServices.displayCordovaToast('Form saved successfully...')
      }, err => { });
    })
  }

  storeDependentLov(item, value) {
    var url = item.url + value + "&forWhichColmn=" + item.column_name + "&userCode=" + this.userDetails.user_code;
    this.http.get(url).map(res => res.json()).subscribe(lovData => {
      this.lov = lovData.locationList;
      for (let data of this.lovs) {
        if (data.column_desc == item.column_desc) {
          data.lov = this.lov;
          for (let data1 of this.dependentlovs) {
            if (data1.dependent_row == item.column_name) {
              data1.dependentLov = this.lov;
            }
          }
        }
      }
      for (let data of this.dependentlovs) {
        if (data.column_desc == item.column_desc) {
          data.lov = this.lov;
          for (let data1 of this.dependentlovs) {
            if (data1.dependent_row == item.column_name) {
              data1.dependentLov = this.lov;
            }
          }
        }
      }
      this.dataServices.storeLOV(this.lov, (item.id + value)).then(data => {
        this.globalObjectServices.displayCordovaToast('Data saved successfully...')
      }, err => { })
    }, err => {
      this.globalObjectServices.displayErrorMessage(status)
    })
  }
}
