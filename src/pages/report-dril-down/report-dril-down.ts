import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, IonicPage, ModalController } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';

@IonicPage()
@Component({
  templateUrl: 'reportDrillDown.html',
  selector: 'page-summary-report'
})
export class ReportDrillDownPage {
  reportDetailLength: any;
  valueFormatArray: any;
  valueFormatLength: any;



  slNo: any = [];
  seq_no: any;
  url: any;
  value: any = 0;
  columnName: any = 0;
  reportHeading: any;
  reportDetail: any = {};
  tableView: any = true;
  horizontalTableData: any;
  searchText: String;
  pageNo: number;
  searchFlag: boolean = false;
  noMoreData: boolean = false;
  valueFormatFlag: any;
  valueFormatVal: any;
  valueFormatData: any;
  login_params: any;
  valueFlag: any = {};
  reportDataLength: number;
  columnCount: any;
  hashIndex: any = [];
  rightAlign: any = [];
  tHeader: any = [];
  tableHeaderData: any = [];
  constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider,
    public viewCtrl: ViewController, public modalCtrl: ModalController, public http: Http) {
    this.slNo = params.get("slNo");
    this.url = this.globalObjects.getScopeUrl();
    this.columnName = params.get("columnName");
    this.seq_no = params.get("seq_no");
    this.value = params.get("value");
    this.valueFormatData = params.get("valueFormat");

    this.valueFlag = params.get("valueToSend");
    // this.valueFormatVal = this.valueFormatData.value;

    this.login_params = this.globalObjects.getLocallData("userDetails");
  }

  ionViewDidLoad(selectedFormat) {
    this.globalObjects.showLoading();
    var partyListvalueFormat: any = []
    // partyListvalueFormat = this.globalObjects.getLocallData("partyListvalueFormat");
    // if (partyListvalueFormat) {
    //   if (partyListvalueFormat.length > 0) {
    //     for (let itemVal of partyListvalueFormat) {
    //       if (itemVal.seqId == this.seq_no) {
    //         if (selectedFormat) {
    //           itemVal.selectedFormat = selectedFormat;
    //         }
    //       }
    //       this.valueFormatVal = itemVal.selectedFormat;
    //     }
    //   }
    // } else {
    //   this.valueFormatVal = this.valueFormatData.value;
    //   partyListvalueFormat = [];
    //   partyListvalueFormat.push({ "seqId": this.seq_no, "selectedFormat": this.valueFormatVal });
    // }
    // if (partyListvalueFormat) {
    //   this.globalObjects.setDataLocally("partyListvalueFormat", partyListvalueFormat);
    // }

    let valurFrmtValue = "";
    if (selectedFormat) {
      valurFrmtValue = this.valueFormatVal;
    } else {
      partyListvalueFormat = this.globalObjects.getLocallData("partyListvalueFormat");
      if (partyListvalueFormat) {
        if (partyListvalueFormat.length > 0) {
          for (let itemVal of partyListvalueFormat) {
            if (itemVal.seqId == this.seq_no) {
              this.valueFormatVal = itemVal.selectedFormat;
            }

          }
        }

      } else {
        this.valueFormatVal = this.valueFormatData.value;
        partyListvalueFormat = [];
        partyListvalueFormat.push({ "seqId": this.seq_no, "selectedFormat": this.valueFormatVal });
      }
      valurFrmtValue=this.valueFormatVal;
      if (partyListvalueFormat) {
        this.globalObjects.setDataLocally("partyListvalueFormat", partyListvalueFormat);
      }
    }




    this.pageNo = 0;
    this.searchText = '';
    this.searchFlag = false;
    this.noMoreData = false;
    var url = this.url + 'reportDrillDownGrid?seqId=' + this.seq_no + "&userCode=" + this.login_params.user_code + "&value=" + this.value +
      '&slNo=' + this.slNo + "&columnName=" + this.columnName + "&searchText=" + this.searchText
      + "&pageNo=" + this.pageNo + "&valueFormat=" +valurFrmtValue + "&JSON=" + JSON.stringify(this.valueFlag);
    this.http.get(url).map(res => res.json()).subscribe(data => {
      // let tableHeaderData = [];
      this.tableHeaderData = data.tableHeader;
      this.globalObjects.hideLoading();
      this.columnCount = data.columnCount;
      this.reportDetail.tableData = data.tableData;
      this.reportDataLength = this.reportDetail.tableData.length;
      this.reportHeading = data.para_desc;
      this.valueFormatFlag = data.valueFormatFlag
      if (this.reportDetail.tableData) {
        this.horizontalTableData = this.globalObjects.transpose(this.reportDetail.tableData);
      }
      this.tHeader = [];
      for (let i = 0; i < this.tableHeaderData.length; i++) {
        // let pd = this.tableHeaderData[i].includes('#PD');
        // let ra = this.tableHeaderData[i].includes('#R');
        // if (pd == true) {
        //   this.hashIndex.push(true);
        // } else {
        //   this.hashIndex.push(false);
        // }
        // if (ra == true) {
        //   this.rightAlign.push("right");
        // } else {
        //   this.rightAlign.push("left");
        // }



        if (this.tableHeaderData[i].includes('#')) {
          var splitVal = this.tableHeaderData[i].split("#")[1];
          if (splitVal == "R") {
            this.rightAlign.push("right");
            this.hashIndex.push(false);
          } else {
            this.hashIndex.push(true);
            this.rightAlign.push("left");
          }
        } else {
          this.hashIndex.push(false);
          this.rightAlign.push("left");
        }





        // if (this.tableHeaderData[i].indexOf("#") > -1) {
        let dataVal = this.tableHeaderData[i].split("#");
        // tableHeaderData[i] = dataVal[0];
        this.tHeader.push(dataVal[0]);
        // }

      }

      // console.log(JSON.stringify(tableHeaderData))
      // this.tHeader = tableHeaderData;
      // }

      // console.log('Right Align:- ' + this.tHeader);
    }, err => { this.globalObjects.hideLoading(); this.reportDataLength = 0 })




  }

  loadMore() {
    var url = this.url + 'reportDrillDownGrid?seqId=' + this.seq_no + "&value=" + this.value +
      '&slNo=' + this.slNo + "&columnName=" + this.columnName + "&searchText=" + this.searchText + "&pageNo=" + (this.pageNo + 1)
      + "&valueFormat=" + "&JSON=" + JSON.stringify(this.valueFlag);;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if (data.tableData) {
        if (data.tableData.length > 0) {
          this.pageNo++;
          this.reportDetail.tableData = this.reportDetail.tableData.concat(data.tableData);
          this.reportDataLength = this.reportDetail.tableData.length;
          this.horizontalTableData = this.globalObjects.transpose(this.reportDetail.tableData);
          this.reportDetailLength = data.tableData.length;
        } else {
          this.noMoreData = true;
        }
      } else {
        this.globalObjects.displayCordovaToast("Data Not Available");
        this.noMoreData = true;
      }

    }, err => { })
  }


  searchReport(searchText) {
    this.pageNo = 0;
    this.noMoreData = false;
    var url = this.url + 'reportDrillDownGrid?seqId=' + this.seq_no + "&value=" + this.value +
      '&slNo=' + this.slNo + "&columnName=" + this.columnName + "&searchText=" + searchText + "&pageNo=" + this.pageNo
      + "&valueFormat=" + "&JSON=" + JSON.stringify(this.valueFlag);;
    this.http.get(url).map(res => res.json()).subscribe(data => {
      if (data.tableData) {
        if (data.tableData.length > 0) {
          this.pageNo++;
          this.reportDetail.tableData = data.tableData;
          this.reportDataLength = this.reportDetail.tableData.length;
          this.horizontalTableData = this.globalObjects.transpose(this.reportDetail.tableData);
        }
      }
      else {
        this.globalObjects.displayCordovaToast("Data Not Available");
        this.noMoreData = true;
      }
    }, err => { })
  }

  closePage() {
    try {
      this.viewCtrl.dismiss();
    } catch (err) {
      console.log(err);
    }

  }

  changeValueFormat(selectedFormat) {
    var tempValdata: any = [];
    tempValdata = this.globalObjects.getLocallData("partyListvalueFormat");
    if (tempValdata) {
      for (let itemVal of tempValdata) {
        if (itemVal.seqId == this.seq_no) {
          itemVal.selectedFormat = selectedFormat;
        }
      }
    } else {
      tempValdata = [];
      tempValdata.push({ "seqId": this.seq_no, "selectedFormat": selectedFormat });
    }
    if (tempValdata) {
      this.globalObjects.setDataLocally("partyListvalueFormat", tempValdata);
    }
    this.ionViewDidLoad(selectedFormat);
  }



  getPartyDetails(party_code, rowIndex, colIndex) {

    if (this.tableHeaderData[colIndex].includes('#PD')) {
      let l_param: any = [];
      l_param.seqNo = this.seq_no;
      l_param.partyCode = party_code;
      this.navCtrl.push('PartyDetailsPage', { sp_obj: l_param });
    } else {
      var slNo = this.tableHeaderData[colIndex].split("#")[1]
      var value = this.reportDetail.tableData[rowIndex];
      try {
        for (var i = 0; i < value.length; i++) {
          value[i] = value[i].replace('&', '^');
          this.tHeader[i] = this.tHeader[i].replace('&', '^');
        }
      } catch (err) {
        console.log(err)
      }
      // this.navCtrl.push('ReportDrillDownPage', {
      //   seq_no: this.seq_no,
      //   value: value.join("~"), slNo: slNo, columnName: this.tableHeaderData, valueFormat: this.valueFormatData, valueToSend: JSON.stringify(this.valueFlag)
      // });

      let reportgraphModal = this.modalCtrl.create('ReportDrillDownPage', {
        seq_no: this.seq_no,
        value: value.join("~"), slNo: slNo, columnName: this.tHeader,
        valueFormat: this.valueFormatData, valueToSend: JSON.stringify(this.valueFlag)
      });
      reportgraphModal.present();
    }

  }
}
