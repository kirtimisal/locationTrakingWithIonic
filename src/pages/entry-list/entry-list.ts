import { Component } from '@angular/core';
import {  NavController, ModalController,   NavParams, IonicPage } from 'ionic-angular';
import { Http } from '@angular/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
// import { AddUpdateEntryPage } from '../add-update-entry/add-update-entry';
import { DatePicker } from '@ionic-native/date-picker';
// import { EntryDetailsInTabularPage } from '../entry-details-in-tabular/entry-details-in-tabular';

@IonicPage()
@Component({
  selector: 'page-entry-list',
  templateUrl: 'entry-list.html',
})
export class EntryListPage {
  searchEntity: { search: string; };
  filter: { from_date: string; to_date: string; };
  sp_obj: any; firstScreen: any; url: any; l_userCode: string; listOfEntries: any; seqId: string = "";
  flagForUpdateButton: any; flagForApproveButton: any; flagForDeleteButton: any; entryDetail: any; entriesLength: string = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, private datePicker: DatePicker, public modalCtrl: ModalController, public globalObjects: GlobalObjectsProvider, private http: Http) {
    this.sp_obj = navParams.get("sp_obj");
    this.url = this.globalObjects.getScopeUrl();
    this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
    this.firstScreen = this.sp_obj.firstScreen;
    this.filter = { from_date: "", to_date: "" };
    this.searchEntity = { search: '' };
  }

  ionViewDidLoad() {
    if ((this.sp_obj.updation_process).indexOf('U') > -1) {
      this.flagForUpdateButton = 'U#';
    }
    if ((this.sp_obj.updation_process).indexOf('A') > -1) {
      this.flagForApproveButton = 'A#';
    }
    if ((this.sp_obj.updation_process).indexOf('D') > -1) {
      this.flagForDeleteButton = 'D#';
    }
    this.loadEntry();
  }


  loadEntry() {
    var l_selectedDate = this.globalObjects.formatDate(this.sp_obj.date2, 'dd-MM-yyyy');
    this.globalObjects.showLoading();
    this.http.get(this.url + 'dynamicEntryList?userCode=' + this.l_userCode + "&reportingDate=" + l_selectedDate + "&seqNo=" + this.sp_obj.seqNo).map(res => res.json()).subscribe(data => {
      this.listOfEntries = data;
      this.entriesLength = this.listOfEntries.length;
      this.globalObjects.hideLoading();
      if (this.listOfEntries == "") {
        this.globalObjects.displayCordovaToast('Entries not available...')
      }
    },
      err => {
        this.listOfEntries = "";
        this.globalObjects.hideLoading();
      })
  }

  getEntryDetails(listData) {
    var l_param: any = [];
    l_param = this.globalObjects.getLocallData("tabParam");
    var self = this;

    if (this.sp_obj.types == 'P') {
      var l_obj: any = [];
      l_obj.seqNo = this.sp_obj.seqNo;
      l_obj.listData = listData;
      this.navCtrl.push('EntryDetailsInTabularPage',{obj:l_obj})
    
    } else {
      var l_seqId = "";
      for (let obj of listData) {
        if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
          l_param.update_key_value = obj.value;
          l_param.update_key_codeOfValue = obj.codeOfValue
          self.seqId = obj.value;
        }
      }
      var updateKeyValue;
      if (l_param.update_key_codeOfValue) {
        updateKeyValue = l_param.update_key_codeOfValue;
      } else {
        updateKeyValue = l_param.update_key_value;
      }

      var url = this.url + 'getEntryDetailDyanamically?tableSeqNo=' + this.sp_obj.seqNo +
        '&entrySeqId=' + l_seqId + "&updateKey=" + updateKeyValue;
      this.http.get(url).map(res => res.json()).subscribe(data => {
        this.seqId = l_seqId;
        let entryDetailsModal = this.modalCtrl.create('EntryDetailsPage', { obj: data, sp_obj: this.sp_obj, seqId: this.seqId, upKey: updateKeyValue });
        entryDetailsModal.present();
      }, err => { })
    }
  }
  addEntry = function () {
    var l_obje: any = [];
    l_obje.type = "addEntry";
    l_obje.table_desc = this.sp_obj.table_desc;
    this.navCtrl.pudh('AddUpdateEntryPage',{sp_obj:l_obje});
   
  }
  showDatepicker(column_name) {
    this.datePicker.show({
      date: new Date(),
      mode: 'date',
      androidTheme: this.datePicker.ANDROID_THEMES.THEME_DEVICE_DEFAULT_DARK
    }).then(
      date => {
        for (let filterVal in this.filter) {
          var dateVal = "";
          if (filterVal == column_name) {
            dateVal = this.globalObjects.formatDate(date, 'dd-MM-yyyy');
            this.filter[filterVal] = dateVal;
          }
        }
      },
      err => console.log('Error occurred while getting date: ', err)
      );
  }

  openUpdateEntry(listData) {
    var self = this;
    var l_param = this.globalObjects.getLocallData("tabParam");
    for (let obj of listData) {
      if (obj.column_name == l_param.update_key || obj.column_name == obj.update_key) {
        l_param.update_key_value = obj.value;
        l_param.update_key_codeOfValue = obj.codeOfValue;
        l_param.seqId = obj.value;
      }
    }
    if (this.sp_obj.types == 'P' || this.sp_obj.types == 'O' || this.firstScreen == 'PO') {
      var l_obj: any = [];
      l_obj.seqNo = this.sp_obj.seqNo;
      l_obj.listData = listData;
      l_obj.types = this.sp_obj.types;
      l_obj.firstScreen = this.firstScreen;
      this.navCtrl.push('EntryDetailsInTabularPage',{obj:l_obj});
    } else {
      l_param.seqId = self.seqId;
      l_param.table_desc = this.sp_obj.table_desc;
      l_param.type = "Update";
      l_param.types = this.sp_obj.types;
      l_param.dependent_next_entry_seq = this.sp_obj.dependent_next_entry_seq;
      this.globalObjects.setDataLocally("tabParam", l_param);
      this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param });
    }

  }

  deleteEntry(item, index) {
    var l_seqId = '';
    for (let obj of item) {
      if (obj.column_name == obj.update_key) {
        l_seqId = obj.value;
      }
    }
    let alertVal = this.globalObjects.confirmationPopup('Do you want to Delete Entry?');
    alertVal.present();
    alertVal.onDidDismiss((data) => {
      var url = this.url + 'deleteEntry?seqId=' + l_seqId + '&seqNo=' + this.sp_obj.seqNo;
      if (data == true) {
        this.http.get(url).map(res => res.json()).subscribe(dataVal => {
          if (dataVal) {
            this.globalObjects.displayCordovaToast("Entry Deleted Successfully..");
            this.listOfEntries = this.listOfEntries.splice(index, 1);
            this.loadEntry();
          }
        },
          err => {
          })
      }
    });

  }

  searchEntry(searchText) {
    var l_selectedDate = this.sp_obj.date2;
    var url = this.url + 'searchedEntryList?userCode=' + this.l_userCode +
      '&reportingDate=' + l_selectedDate + '&seqNo=' + this.sp_obj.seqNo + "&fromDate=&toDate=&searchText=" + searchText;
    this.http.get(url).map(res => res.json()).subscribe(dataVal => {
      this.listOfEntries = dataVal;
      if (this.listOfEntries == "") {
        this.globalObjects.displayCordovaToast("Entries not available...");
      }
    }, err => { this.listOfEntries == "" })
  }

  filterEntry(from_date, to_date) {
    var l_selectedDate = this.sp_obj.date2;
    if (!from_date) {
      let alertVal = this.globalObjects.showAlert("Please select From Date");
      alertVal.present();
    } else if (!to_date) {
      let alertVal = this.globalObjects.showAlert("Please select To Date");
      alertVal.present();
    } else {
      var year = from_date.substring(6, 10); //6 character
      var month = from_date.substring(3, 5);
      var date = from_date.substring(0, 2);
      var endYear = to_date.substring(6, 10);
      var endMonth = to_date.substring(3, 5);
      var endDate = to_date.substring(0, 2);
      var startDate = new Date(year, month - 1, date);
      endDate = new Date(endYear, endMonth - 1, endDate);
      if (startDate > endDate) {
        let alertVal = this.globalObjects.showAlert("To date should be greater than From date");
        alertVal.present();
      } else {
        var url = this.url + 'searchedEntryList?userCode=' + this.l_userCode +
          '&reportingDate=' + l_selectedDate + '&seqNo=' + this.sp_obj.seqNo + "&fromDate=" + from_date + "&toDate=" + to_date + "&searchText=";
        this.http.get(url).map(res => res.json()).subscribe(dataVal => {
          this.listOfEntries = dataVal;
          this.entriesLength = this.listOfEntries.length;
          if (this.listOfEntries == "") {
            this.globalObjects.displayCordovaToast("Entries not available...");
          }
        }, err => { this.listOfEntries == "" })
      }
    }

  }
}
