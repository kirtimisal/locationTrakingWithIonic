import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { AddUpdateEntryServicesProvider } from '../../providers/add-update-entry-services/add-update-entry-services';
import { DataServicesProvider } from '../../providers/data-services/data-services';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
  selector: 'page-populated-order-entry',
  templateUrl: 'entry-details-in-tabular.html',
})
export class EntryDetailsInTabularPage {
  equationOP: any;
  auto_calculation_eq: any;
  tableData: any;
  temp_data: any;
  summaryRow: any;
  url: string;
  l_userCode: any; online: boolean;
  typesForOrderPopulated: any;
  l_obj: any = []; l_seqId = ""; l_Vrno = "";
  listData: any; l_data = "";
  tableHeader: any = []; entry_by_user: any = [];
  item_help_property: any = []; nullable: any = [];pattern:any=[];
  tool_tip: any = []; column_size: any = []; column_name: any = []; from_value: any = []; to_value: any = [];
  column_type: any = [];
  dropdownVal: any = [];
  auto_calculation: any = [];
  equationCOL: any = [];
  summaryRowVal: any = [];
  decimal_digit: any = []; entryDetailsinTabular: any = [];
  listOfPopulatedEntriesData: any = [];
  l_TableHeaderData: any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,private pouchDBService: PouchDBService, private dataServices: DataServicesProvider, private addUpdateEntryServices: AddUpdateEntryServicesProvider, private http: Http, public globalObjects: GlobalObjectsProvider) {
    this.url = this.globalObjects.getScopeUrl();
    this.l_obj = this.navParams.get('obj');
    this.online = this.globalObjects.getOnlineStatus();
  }

  ionViewDidLoad() {
    this.listData = this.l_obj.listData;
    this.typesForOrderPopulated = this.l_obj.types;
    this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
    if (this.listData) {
      for (let obj of this.listData) {
        if (obj.column_name == "SEQ_ID") {
          this.l_seqId = obj.value;
        }
        if (obj.column_desc == "VRNO") {
          this.l_Vrno = obj.value;
        }
      }
    }
    if (this.l_obj.types == 'O' || this.l_obj.firstScreen == 'PO') {
      this.l_obj.seqNo = parseFloat(this.l_obj.seqNo) + parseFloat("0.1");
      this.l_obj.seqNo = parseFloat(this.l_obj.seqNo).toFixed(1);
    }
    if (this.online) {
      var l_url = this.url + "entryDetailInTabular?seqNo=" + this.l_obj.seqNo + "&vrno=" + this.l_Vrno + "&userCode=" + this.l_userCode
        + "&accCode=" + "&searchText=";
      this.http.get(l_url).map(res => res.json()).subscribe(data => {
        this.entryDetailsinTabular = data.recordInfo;
        this.l_TableHeaderData = this.entryDetailsinTabular.tableHeader.recordsInfo;
        this.setData();
      }, err => { })
    } else {
      this.pouchDBService.getObject(this.l_obj.seqNo+ "_seqNo").then(data=> {
        this.entryDetailsinTabular.tableData = [];
        this.entryDetailsinTabular.tableHeader = data;
        this.l_TableHeaderData = this.entryDetailsinTabular.tableHeader.recordsInfo;
        this.setData();
      })

    }
  }

  calculateSummary(tableData, tableHeader, summaryRow) {
    summaryRow = summaryRow[0];
    var summaryRowValue = JSON.parse(JSON.stringify(summaryRow));

    var totalIndex = summaryRow.indexOf("T");
    var countIndex = summaryRow.indexOf("C");
    var avgIndex = summaryRow.indexOf("A");
    var rowCountIndex = summaryRow.indexOf("R");
    var total;
    var count;
    var avg;
    var rowCount = 0;
    var avgCount = 1;

    for (let data of tableData) {
      if (total) {
        total = total + parseInt(data[totalIndex]);
      } else {
        total = parseInt(data[totalIndex]);
      }

      if (count) {
        count = count + parseInt(data[countIndex]);
      } else {
        count = parseInt(data[countIndex]);
      }

      if (avg) {
        avg = (avg * (avgCount - 1) + parseFloat(data[avgIndex])) / avgCount;
        avgCount++
      } else {
        avg = parseFloat(data[avgIndex]);
        avgCount++;
      }
      rowCount++;

    }

    for (var i = 0; i < summaryRowValue.length; i++) {
      summaryRowValue[i] = '';
    }

    summaryRowValue[0] = 'Summary:';
    if (totalIndex > -1) {
      summaryRowValue[totalIndex + 1] = "Grand Total : " + total;
    }
    if (countIndex > -1) {
      summaryRowValue[countIndex + 1] = "Item Count : " + count;
    }
    if (avgIndex > -1) {
      summaryRowValue[avgIndex + 1] = "Average : " + avg.toFixed(2);
    }
    if (rowCountIndex > -1) {
      summaryRowValue[rowCountIndex + 1] = "Count: " + rowCount;
    }

    this.summaryRow = summaryRowValue;
    return tableData;
  }
  setData() {
    var listOfPopulatedEntriesData: any = [];
    var l_tableData: any = [];
    
    l_tableData = this.l_TableHeaderData;
    for(let obj1 of this.l_obj.entryList){
      for(let obj of obj1){
        listOfPopulatedEntriesData.push(obj);
      }
    }
    if (this.l_obj.types == 'PO') {

      var tableDataValue: any = [];
      var uniqueIDValue = "";

      for(let obj1 of this.l_obj.entryList){
        var tableData = [];
        var tempRow = [];
        for(let obj2 of obj1){

          for(let obj of l_tableData){
            if (obj2.column_name == obj.column_name) {
              if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
                tableData.push(obj2.value);
                tempRow.push(obj2.summary_function_flag);
              }
            }
            if (obj2.slno) { uniqueIDValue = obj2.slno; }
          }
        }
        this.summaryRowVal.push(tempRow);
        tableData.push(uniqueIDValue);
        tableDataValue.push(tableData)
      }
      this.entryDetailsinTabular.tableData = tableDataValue;
    }
    this.temp_data = this.entryDetailsinTabular.tableData;
    this.tableData = JSON.parse(JSON.stringify(this.temp_data));
    this.tableData = this.calculateSummary(this.tableData, this.tableHeader, this.summaryRowVal);
    if (this.l_obj.types == 'PO') { } else {
      for (let obj of this.tableData) {
        for (var i = 0; i < obj.length; i++) {
          if (obj[i]) {
            if ((obj[i]).indexOf("~") > -1) {
              this.l_data = obj[i].split("~");
              obj[i] = this.l_data[1];
            } else { }
          }
        }
      }
    }
    var l_value = '';
    this.tableHeader.push(l_value); //For table's first column
    for (let obj of l_tableData) {
      var v = '';
      var l_item_help_property = '';
      for (let key in obj) {
        if (key == 'column_desc') {
          v = obj[key];
          l_item_help_property = obj.item_help_property;
        }
        if (key == "entry_by_user") {
          if (obj[key] == "T" || obj[key] == "R" && v !== '') {
            this.tableHeader.push(v);
            this.entry_by_user.push(obj[key]);
          }
        }
      }
      if (obj.entry_by_user == "T" || obj.entry_by_user == "R" && obj.entry_by_user !== '') {
        this.nullable.push(obj.nullable);
        this.tool_tip.push(obj.tool_tip);
        this.column_size.push(obj.column_size);
        this.column_name.push(obj.column_name);
        this.from_value.push(obj.from_value);
        this.to_value.push(obj.to_value);
        this.column_type.push(obj.column_type);
        this.decimal_digit.push(obj.decimal_digit);
        this.pattern.push(obj.pattern);

        if (obj.column_type == "BARCODE") {
          obj.item_help_property = "B"
        }
        if (obj.column_type == "DATETIME") {
          obj.item_help_property = "T"
        }
        if (obj.column_type == "NUMBER") {
          obj.item_help_property = "N"
        }
        if (obj.item_help_property == "H") {
          var dropdownVal = obj.dropdownVal.split("#");
          var temp1 = [];
          for(let element of dropdownVal){
            var temp2 = element.split("~");
            temp1.push({
              name: temp2[1],
              code: temp2[0]
            });
          }
          obj.dropdownVal = temp1;
        }
        if (obj.item_help_property == "D") {
          obj.dropdownVal = obj.dropdownVal.split("#");
        }
        if (obj.auto_calculation !== null) {
          this.auto_calculation_eq = obj.auto_calculation;
          this.equationOP = obj.column_name;
        }
        this.dropdownVal.push(obj.dropdownVal);
        this.item_help_property.push(obj.item_help_property);
      }
    }
    for (let obj2 of l_tableData) {
      if (obj2.entry_by_user == "T" || obj2.entry_by_user == "R" && obj2.entry_by_user !== '') {
        if (this.auto_calculation_eq) {
          if ((this.auto_calculation_eq.indexOf(obj2.column_name)) > -1) {
            obj2.auto_calculation = this.auto_calculation_eq;
            obj2.equationOP = this.equationOP;
          }
          this.auto_calculation.push(obj2.auto_calculation);
          this.equationCOL.push(obj2.equationOP);
        }
      }
    }
    this.listOfPopulatedEntriesData = this.l_obj.entryList;
  }

  rowWiseAutoCalculation(auto_calculation, equationOP, tableData, seqId) {
    this.tableData = this.addUpdateEntryServices.rowWiseAutoCalculation(auto_calculation,
      equationOP, tableData, seqId, this.l_TableHeaderData, this.tableData);
    this.tableData = this.calculateSummary(this.tableData, this.tableHeader, this.summaryRowVal);
  }

  addUpdatedEntry(TableData) {
    var object = {};
    var key = "";
    var rowsOfPopulateData = [];
    var l_recordsInfo = [];
    var dataListToSend = {};
    var l_data = '';
    var TableDataLength;
    var temp_data_length;
    var Data = JSON.parse(JSON.stringify(TableData));
    if ((this.temp_data.length) > (TableData.length)) {
      temp_data_length = TableData.length;
    } else {
      temp_data_length = this.temp_data.length;
    }
    var tableDataValue1 = [];
    if (this.l_obj.types == 'PO') {
      for (let obj1 of this.listOfPopulatedEntriesData) {
        var tableData1 = [];
        for (let obj2 of obj1) {
          for (let obj of this.l_TableHeaderData) {
            if (obj2.column_name == obj.column_name) {
              if (obj2.codeOfValue) {
                obj2.value = obj2.codeOfValue;
              }
              if (obj.value) {
                obj2.value = obj.value;
              }
              if (obj.column_name == this.l_obj.searchTextColumnName) {
                obj2.value = this.l_obj.searchText;
              }
              tableData1.push({ "column_name": obj.column_name, "value": obj2.value });
            }
          }
        }
        tableDataValue1.push(tableData1)
      }


      if (this.online) {
        this.dataServices.uploadAllEntry(tableDataValue1, this.l_obj.seqNo, this.url, "").then((data) => {
          var dataVal: any = data;
          if (dataVal.status == "insert data") {
            this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
            this.deleteAllEntry();
            this.navCtrl.pop();
            this.navCtrl.setRoot('HomePage');
          } else {
            if (dataVal.status == "updated data") {
              this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
              this.navCtrl.setRoot('HomePage');
            } else {
              this.globalObjects.displayCordovaToast(dataVal.status);
            }
          }
        }, function (err) {
          this.globalObjects.displayErrorMessage(err);
        });
      } else {

        var tempDate = this.globalObjects.formatDate(new Date(), 'MM-dd-yyyy hh:mm:ss');
        tableDataValue1.push({
          column_desc: "DATE",
          column_name: "DATE",
          column_type: "DATE",
          entry_by_user: "F",
          value: tempDate
        });
        this.dataServices.addEntryToLoacalDB(tableDataValue1, parseInt(this.l_obj.seqNo), this.tableHeader, "1", "uploadEntryStatus", "PO").then(data=> {
            this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
            this.deleteAllEntry();
            this.navCtrl.setRoot('HomePage');
        }, err=> {
            this.globalObjects.displayCordovaToast('Try Again...')
        })
      }

    } else {
      for (let key in this.temp_data) {
        TableDataLength = Object.keys(this.temp_data[key]).length;
      }

      for (var i = 0; i < temp_data_length; i++) {
        for (var j = 0; j < TableDataLength; j++) {
          if (this.temp_data[i][j]) {
            if ((this.temp_data[i][j]).indexOf("~") > -1) {
              l_data = this.temp_data[i][j].split("~");
              Data[i][j] = l_data[0];
            }
          }
        }
      }

      for(let obj of Data){
        for (let key in obj) {
          var column_name = this.column_name[key];
          var SEQ_ID = "SEQ_ID";
          var DYNAMIC_TABLE_SEQ_ID = "DYNAMIC_TABLE_SEQ_ID";
          if (column_name == undefined || column_name == '') {
            object[SEQ_ID] = obj[key];
          } else {
            object[column_name] = obj[key];
          }
          for(let temp of this.l_TableHeaderData){
            if (temp.column_desc == "User Code" || temp.column_name == "USER_CODE" ||
              temp.column_name == "EMP_CODE") {
              object[temp.column_name] = this.l_userCode;
            }
          }
          object[DYNAMIC_TABLE_SEQ_ID] = this.l_obj.seqNo;
        }
        var l_tempCopy = JSON.parse(JSON.stringify(object));
        rowsOfPopulateData.push(l_tempCopy);
      }
      for (let key in rowsOfPopulateData) {
        l_recordsInfo.push({
          recordsInfo: [rowsOfPopulateData[key]]
        });
      }

      key = "list";
      dataListToSend[key] = l_recordsInfo;
      var fd = new FormData();
      var uploadUrl = this.url + 'multipleUpdateEntryInfo';
      fd.append('jsonString', JSON.stringify(dataListToSend));
      console.log("dataListToSend" + JSON.stringify(dataListToSend))

      this.http.post(uploadUrl, fd).map(res => res.json()).subscribe(data => {
        if (data.status == "updated data") {
          this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
          this.navCtrl.setRoot('HomePage');
        } else {
          this.globalObjects.displayCordovaToast('Try Again..');
        }
      }, err => { })

    }
  }

  deleteAllEntry() {
    var id = "entrySeqNo" + this.l_obj.seqNo;
    this.globalObjects.destroyLocalData(id);
  }
  deleterow(index, seq_id) {
    let alertVal = this.globalObjects.confirmationPopup('Do you want to Delete Entry?');
    alertVal.present();
    alertVal.onDidDismiss((data) => {
      if (data == true) {
        this.tableData = this.globalObjects.deleteEachRow(this.tableData, index);
        if (this.l_obj.types == 'PO') {
          this.deleteOrderPopulatedEntry(seq_id, index)
        } else { }
        this.globalObjects.displayCordovaToast('Entry Deleted Successfully..')
      }
    });
  }

  deleteOrderPopulatedEntry(seq_id, index) {
    var id = "entrySeqNo" + this.l_obj.seqNo;
    var listOfPopulatedEntriesData: any = [];
    var flag;
    var listOfPopulatedEntries = this.globalObjects.getLocallData(id);
    for (let obj1 of listOfPopulatedEntries) {
      for (let obj of obj1) {
        if (obj.slno == seq_id) {
          flag = 0;
        } else {
          flag = 1;
        }
      };
      if (flag == 1) {
        listOfPopulatedEntriesData.push(obj1);
      }
    }
    this.globalObjects.setDataLocally(id, listOfPopulatedEntriesData);
    this.tableData = this.calculateSummary(this.tableData, this.tableHeader, this.summaryRowVal);
  }

  closePage() {
    this.navCtrl.pop();
  }
  cancelAddUpdateEntry(){
    this.navCtrl.setRoot('HomePage');
  }
}
