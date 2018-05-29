import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { DataServicesProvider } from '../../providers/data-services/data-services';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  selector: 'page-offline-refresh-form',
  templateUrl: 'offline-refresh-form.html',
})
export class OfflineRefreshFormPage {
  lovs: any;
  formData: any;
  dependentlovs: any;
  defaultPopulatedData: any;
  lov: any;
  value: any = [];
  dpdStore: any = [];
  defaultValue: any = [];
  lovDataStore: any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private viewCtrl: ViewController,
    private dataServices: DataServicesProvider, private globalObjectServices: GlobalObjectsProvider) {
    this.lovs = this.navParams.get('lovs');
    this.formData = this.navParams.get('formData');
    this.dependentlovs = this.navParams.get('dependentLov');
    this.defaultPopulatedData = this.navParams.get('defaultPopulateData');
    this.lovDataStore = [];
  }

  storeForm(seqNo, formData) {
    this.dataServices.setOfflineForm(seqNo, formData).then(data => {
      this.globalObjectServices.displayCordovaToast('Form saved successfully...');
    }, err => { });
  }


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
      for (let data1 of this.defaultPopulatedData) {
        if (data1.dependentLov) {
          for (let data2 of data1.dependentLov) {
            this.defaultValue.push(data2.code);
          }
        }

      }
      for (let data1 of this.dependentlovs) {
        if (data1.dependentLov) {
          for (let data2 of data1.dependentLov) {
            this.value.push(data2.code);
          }
        }
      }
      this.dataServices.storeLOV(this.lov, item.id).then(data => {
        this.globalObjectServices.displayCordovaToast('Data saved successfully...')
      }, err => { })
    }, err => { })
  }

  storeDependentLov1(item, values): Promise<any> {
    var loopPromises: any = [];
    for (let value in values) {
      loopPromises.push(new Promise((resolve, reject) => {
        var url = item.url + (values[value]).trim() + "&forWhichColmn=" + item.column_name + "&userCode=" + this.globalObjectServices.getLocallData("userDetails").user_code;
        this.http.get(url).map(res => res.json()).subscribe(lovData => {
          this.lovDataStore.push({ lovData: lovData, value: values[value] });
          resolve(true);
        })
      }));

    }
    return Promise.all(loopPromises);
  }

  storeDependentLov(item, values) {
    this.storeDependentLov1(item, values).then(() => {
      this.storeDependentLovs(item, values.length, 0);
    })
  }

  storeDependentLovs(item, total, current) {
    if (current == 0) {
      this.globalObjectServices.showLoading();
    }
    if (current < total) {
      var lovData = this.lovDataStore[current].lovData;
      var value = this.lovDataStore[current].value;
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
        this.storeDependentLovs(item, total, current + 1);
      }, err => { })
    } else {
      this.globalObjectServices.hideLoading();
      this.globalObjectServices.displayCordovaToast('Data saved successfully...');
    }
  }

  storeDefaultPopulatedData(item, value) {
    var values;
    try {
      values = value.split(",");
    } catch (err) {
      values = value;
    }
    var seqNo = (item.seqNo + 0.1).toFixed(1);
    for (var i = 0; i < values.length; i++) {
      if (i == 0) {
        this.globalObjectServices.showLoading();
      }
      this.storeDefaultPopulatedData1(seqNo, values[i], i + 1, values.length);
    }
  }

  storeDefaultPopulatedData1(seqNo, value, current, total) {
    var url = this.globalObjectServices.getScopeUrl() + 'addEntryForm?seqNo=' + seqNo + '&userCode=' + this.globalObjectServices.getLocallData("userDetails").user_code + '&accCode=' + this.globalObjectServices.getLocallData("userDetails").acc_code + '&searchText=' + value;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      this.dpdStore.push({
        seqNo: seqNo, value: value, data: data
      })
      if (current == total) {
        this.storeDefaultPopulatedData3(total, 0);
      }
    })
  }


  storeDefaultPopulatedData3(total, current) {
    if (current < total) {
      var myItem = this.dpdStore[current];
      this.dataServices.setOfflineDefaultPopulatedData(myItem.seqNo, myItem.data, myItem.value).then(data => {
        this.storeDefaultPopulatedData3(total, current + 1)
      }, err => { });
    } else {
      this.globalObjectServices.hideLoading();
      this.globalObjectServices.displayCordovaToast('Form saved successfully...');
      this.dpdStore = [];
    }
  }


  storeDefaultPopulatedData2(seqNo, value, data) {
    this.dataServices.setOfflineDefaultPopulatedData(seqNo, data, value).then(data => {
      this.globalObjectServices.displayCordovaToast('Form saved successfully...')
    }, err => { });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }
}
