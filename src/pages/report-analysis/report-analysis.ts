import { Component } from '@angular/core';
import { NavController, NavParams, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { PopoverController } from 'ionic-angular';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
  selector: 'page-summary-report',
  templateUrl: 'report-analysis.html',
})
export class ReportAnalysisPage {
  accCodeVal: any = [];
  valueFormatData1: any;
  reverse: boolean;
  currentFilter: any;
  selectedChart: string;

  public ChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true,
    maintainAspectRatio: false
  };



  //  [{ backgroundColor: ["#ff6384","#36a2eb","#ffce56","#8b8c8e","#00d4b8","#4ce600","#4ce600"] }]
  public pieDoChartColors: any[] = [{ backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4"] },
  ]

  public barHorizontalChartColors: any[] = [
    // { backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#BB8FCE", "#00d4b8", "#52BE80", "#EC7063", "#E59866", "#F4BCF4","#884EA0"] }
    { backgroundColor: "#ff6384" },
    { backgroundColor: "#36a2eb" },
    { backgroundColor: "#ffce56" },
    { backgroundColor: "#BB8FCE" },
    { backgroundColor: "#00d4b8" },
    { backgroundColor: "#52BE80" },
    { backgroundColor: "#EC7063" },
    { backgroundColor: "#E59866" },
    { backgroundColor: "#F4BCF4" },
    { backgroundColor: "#ff6384" },
    { backgroundColor: "#884EA0" },
  ]
  public chartColors: any[] = [

    {
      backgroundColor: 'rgba(255, 99, 132, .3)',
      borderColor: 'rgb(253,38,84)',
      pointBackgroundColor: 'rgb(255, 99, 132)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255, 99, 132, .9)'

    },
    {
      backgroundColor: 'rgba(54,162,235,0.6)',
      borderColor: 'rgb(10,156,255)',
      pointBackgroundColor: 'rgb(54,162,235)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(54,162,235, .8)'

    },
    {
      backgroundColor: 'rgba(255,206,86, .3)',
      borderColor: 'rgb(245,181,27)',
      pointBackgroundColor: 'rgb(255,206,86)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(255,206,86, .8)'

    },
    {
      backgroundColor: 'rgba(187,143,206, .3)',
      borderColor: 'rgb(99,101,105)',
      pointBackgroundColor: 'rgb(187,143,206)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(187,143,206, .8)'

    },
    {
      backgroundColor: 'rgba(0,212,184, .3)',
      borderColor: 'rgb(2,169,147)',
      pointBackgroundColor: 'rgb(0,212,184)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(0,212,184, .8)'

    },
    {
      backgroundColor: 'rgba(82,190,128, .3)',
      borderColor: 'rgb(82,190,128)',
      pointBackgroundColor: 'rgb(82,190,128)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(82,190,128, .8)'

    },
    {
      backgroundColor: 'rgba(236,112,99, .6)',
      borderColor: 'rgb(236,112,99)',
      pointBackgroundColor: 'rgb(236,112,99)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(236,112,99, .8)'

    }, {
      backgroundColor: 'rgba(229,152,102, .3)',
      borderColor: 'rgb(229,152,102)',
      pointBackgroundColor: 'rgb(229,152,102)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(229,152,102, .8)'

    },
    {
      backgroundColor: 'rgba(244,188,244, .3)',
      borderColor: 'rgb(244,188,244)',
      pointBackgroundColor: 'rgb(244,188,244)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(244,188,244, .8)'
    }
  ]



  graphData: any;
  public ChartLegend: boolean = true;
  aggregateData: any;
  ChartData: any = []
  labels: string[];
  valueFormatArray: any = [];
  valueFormatLength: any = 0;
  valueFormatVal: any;
  valueFormatData: any;
  data: any = [];
  colors: any;
  ChartType: string;
  series: any = [];
  lineChartData: Array<any>;
  lineChartLabels: Array<any>;
  graphTypeList: any = [];
  reportHeading: any;
  reportDetail: any = [];
  l_graphData: any;
  columnName: any = [];
  searchEntity: any;
  flagForTableView: number; tableView: any;
  flagForPageChange: number;
  reportingType: any;
  ReportList: any = [];
  flagforVerticleTable: number;
  tableValue: any = [];
  myTableData: any = []; searchFlag: any;
  graphGabelDetail: any;
  searchPageCount: number;
  detailLabelDataLength: any;
  pageCount: number; url: any; login_params: any; searchPlaceHolder: any;
  sp_obj: any; paginationFlag: any; filteredParam: any = []; hashIndex: any = [];
  showTableFlag: any; selectedValues: string; flagForTypeChange: any; seriesData: any = []; horizontalTableData: any;
  labelData: any = []; tableheader: any = []; detailLabelData: any; columnWidth: any; columnAlignment: any; noOfColumns: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public pouchDBService: PouchDBService, public popoverCtrl: PopoverController, private http: Http, public modalCtrl: ModalController,
    public globalObjects: GlobalObjectsProvider) {
    this.sp_obj = this.navParams.get("obj");
    this.sp_obj.valueToSend = this.navParams.get("valueToSend");
    this.url = this.globalObjects.getScopeUrl();
    this.login_params = this.globalObjects.getLocallData("userDetails");
    this.paginationFlag = this.sp_obj.paginationFlag;
    this.filteredParam.push(this.sp_obj.filteredParam);
    this.flagForPageChange = 1;
    this.flagForTableView = 1;
    this.flagforVerticleTable = 0;
    this.tableView = true;
    if (this.sp_obj.firstScreen == 1) {
      this.showTableFlag = 1;
    }
    this.selectedValues = "Tabular";
    this.selectedChart = "Bar Chart";
    this.ChartType = "bar";
    this.flagForTypeChange = 4;
    var JSONvalue: any = {};
    JSONvalue.data = new Array();
    this.pageCount = 0;
    this.searchPageCount = 0;

    console.log(this.chartColors);
  }

  ionViewDidLoad(valueFormatData) {

    this.flagforVerticleTable = 0;
    // if (showLoaderFlag == "showLoader") {
    //   this.globalObjects.showLoading();
    // } else {
    //   this.globalObjects.hideLoading();
    // }
    var flagVal = "";
    if (valueFormatData) {
      if (valueFormatData == "clearData") {
        this.valueFormatData = this.valueFormatVal;
        flagVal = "true";
      } else {
        this.valueFormatData = valueFormatData;
      }
    } else {
      this.valueFormatData = "";
    }
    var l_url = "";
    this.tableValue = [];
    this.reportingType = this.sp_obj.reportingType;
    var graphDisplay = true;
    this.ReportList = [];
    this.ReportList.push({ reportType: "Tabular" });
    if (valueFormatData != "clearData") {
      if (this.sp_obj.valueFormat && !this.valueFormatData && !flagVal) {
        this.valueFormatLength = this.sp_obj.valueFormat.length;
        for (let obj of this.sp_obj.valueFormat) {
          if (obj.dropdownVal) {
            var dropdownVal = obj.dropdownVal.split("#");
            var temp1 = [];
            for (let element of dropdownVal) {
              var temp2 = element.split("~");
              temp1.push({ name: temp2[1], code: temp2[0] });
            }
            obj.dropdownVal = temp1;
            if (obj.value) {
              for (let obj1 of temp1) {
                if (obj1.name == obj.value) {
                  obj.value = obj1.code;
                  obj.codeOfValue = null;
                }
              }
            }

          }
          this.valueFormatArray = obj.dropdownVal;
          this.valueFormatVal = obj.value;
        }
      }
    }
    if (!this.searchEntity) {
      this.searchEntity = "";
    }
    if (valueFormatData) {
      l_url = this.url + "tableLabelPagedDetail?seqNo=" + this.sp_obj.seq_no + '&userCode=' + this.login_params.user_code + "&pageNo=" + this.pageCount + "&valueFormat=" + this.valueFormatData + "&searchText=" + this.searchEntity;
    } else {
      l_url = this.url + "tableLabelPagedDetail?seqNo=" + this.sp_obj.seq_no + '&userCode=' + this.login_params.user_code + "&pageNo=" + this.pageCount + "&valueFormat=" + this.navParams.get("valueFormat") + "&searchText=" + this.searchEntity;
    }
    this.globalObjects.showLoading();
    this.http.get(l_url).map(res => res.json()).subscribe(data => {
      this.globalObjects.hideLoading();
      this.graphGabelDetail = data.graphGabelDetail;
      this.l_graphData = data.graphGabelDetail;


      // if (showLoaderFlag == "showLoader") {
      //   this.globalObjects.hideLoading();
      // }
      for (let temp of this.graphGabelDetail) {
        this.graphData = temp.graphData;
        this.graphTypeList = temp.graphType;
        this.detailLabelData = temp.graphLabelData;
        this.tableheader = temp.series;
        this.columnWidth = temp.columnWidth;
        this.columnAlignment = temp.columnAlignment;
        this.noOfColumns = temp.noOfColumns;
        this.columnName = temp.columnName;
        this.setDataValues();
        this.horizontalTableData = this.globalObjects.transpose(this.detailLabelData);
        this.searchPlaceHolder = temp.searchPlaceHolder;
        this.paginationFlag = temp.paginationFlag;
        if (this.detailLabelData.length == 1) {
          this.flagforVerticleTable = 1;
          var i = 0;
          for (let obj2 of this.detailLabelData) {
            for (let obj1 of temp.series) {
              this.tableValue.push({
                "series": obj1,
                "value": obj2[i]
              });
              i++;
            }
          }
        }
        for (let obj of this.detailLabelData) {
          var temp2 = [];
          var count = 0;
          for (let obj2 of obj) {
            let a = {};
            a[count] = obj2
            temp2.push(a)
            count++;
          }
          this.myTableData.push(temp);
        }

        if (temp.graphDisplayFlag == 'G') {
          if (graphDisplay) {
            this.ReportList.push({ reportType: "Graph" });
            graphDisplay = false;
          }
        }
      }
      this.detailLabelDataLength = this.detailLabelData.length;
      this.calculate("");

      if (this.flagForTypeChange == 5) {
        this.openPageByType(this.selectedValues);
      }
    }, err => { this.globalObjects.hideLoading(); })
  }
  changeTableview() {
    this.globalObjects.showLoading();
    if (this.tableView == false) {
      this.flagForTableView = 0;
      this.globalObjects.hideLoading();
    } else {
      this.flagForTableView = 1;
      this.globalObjects.hideLoading();
    }
  }

  searchData(searchText) {
    this.searchEntity = searchText;
    this.ionViewDidLoad("clearData");
  }
  loadMoreTableData(searchFlag, searchText) {
    var l_url;
    this.globalObjects.showLoading();
    if (!searchText) { searchText = "" }
    if (searchFlag) {
      this.searchPageCount++;
      l_url = this.url + "tableLabelPagedDetail?seqNo=" + this.sp_obj.seq_no + '&userCode=' + this.login_params.user_code + "&pageNo=" + this.searchPageCount + "&valueFormat=" + this.valueFormatVal + "&searchText=" + searchText;
    } else {
      this.pageCount++;
      l_url = this.url + "tableLabelPagedDetail?seqNo=" + this.sp_obj.seq_no + '&userCode=' + this.login_params.user_code + "&pageNo=" + this.pageCount + "&valueFormat=" + this.valueFormatVal + "&searchText=" + searchText;
    }
    this.http.get(l_url).map(res => res.json()).subscribe(data => {
      this.graphGabelDetail = data.graphGabelDetail;
      this.globalObjects.hideLoading();
      for (let obj of this.graphGabelDetail) {
        var popData;
        var popdataCount = 0;
        var popDataIndex;
        if (obj.graphLabelData.length > 0) {
          for (let series_obj of obj.series) {
            if (series_obj.indexOf('#') > -1) {
              popData = series_obj;
              popDataIndex = popdataCount;
              this.detailLabelData.pop();
            }
            popdataCount++;
          }
          for (let objj of this.l_graphData) {
            objj.graphLabelData = objj.graphLabelData.concat(obj.graphLabelData);
          }
          this.detailLabelData = this.detailLabelData.concat(obj.graphLabelData);
          this.setDataValues();
          var temp2 = this.globalObjects.transpose(obj.graphLabelData);
          var coutnt = 0;
          var temp = [];
          for (let obj of this.horizontalTableData) {
            if (popDataIndex == coutnt) {
              if (popData) {
                if (popData.indexOf('#T') > -1) {
                  obj.pop();
                }
                if (popData.indexOf('#C') > -1) {
                  obj.pop();
                }
                if (popData.indexOf('#A') > -1) {
                  obj.pop();
                }
              }
            }
            obj = obj.concat(temp2[coutnt]);
            temp[coutnt] = obj;
            coutnt++;
          }
          this.horizontalTableData = temp;
          this.detailLabelDataLength = this.detailLabelData.length;
          this.calculate(obj.series);
        } else {
          this.globalObjects.displayCordovaToast("No more data available");
          this.paginationFlag = 'F';
        }
      }
    }, err => { this.globalObjects.hideLoading(); })
  }
  setDataValues() {
    for (let i = 0; i < this.detailLabelData.length; i++) {
      for (let j = 0; j < this.detailLabelData[i].length; j++) {
        if (this.detailLabelData[i][j]) {
          if (this.detailLabelData[i][j].indexOf("#") > -1) {
            let splitValues = this.detailLabelData[i][j].split("#");
            this.detailLabelData[i][j] = splitValues[0];
            this.accCodeVal[i] = splitValues[1];
          }

        }
      }
    }
  }
  calculate(tableSeries) {
    var lastRow = [];
    var lastRow1 = [];
    var lastRow2 = [];
    var lastRow3 = [];
    var tempAvgCount;
    if (tableSeries != "") {
      this.tableheader = tableSeries;
    }
    if (this.tableheader) {
      for (var i = 0; i < this.tableheader.length; i++) {
        if ((this.tableheader[i]).indexOf('#') > -1) {
          var th = this.tableheader[i].split("#");
          if (th[1] == "T" || th[1] == "A" || th[1] == "C" || th[2] == "T" || th[2] == "A" || th[2] == "C") {
            tempAvgCount = 1;
            this.detailLabelData.forEach((obj) => {
              if (th[1] == "T") {
                if (lastRow1[i]) {
                  lastRow1[i] = "TOTAL : " + Math.round((parseFloat(lastRow1[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                } else {
                  lastRow1[i] = "TOTAL : " + parseFloat(obj[i]);
                }
              }
              if (th[2] == "T") {
                if (lastRow2[i]) {
                  lastRow2[i] = "TOTAL : " + Math.round((parseFloat(lastRow2[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                } else {
                  lastRow2[i] = "TOTAL : " + parseFloat(obj[i]);
                }
              }
              if (th[3] == "T") {
                if (lastRow3[i]) {
                  lastRow3[i] = "TOTAL : " + Math.round((parseFloat(lastRow3[i].split(":")[1]) + parseFloat(obj[i])) * 1000) / 1000;
                } else {
                  lastRow3[i] = "TOTAL : " + parseFloat(obj[i]);
                }
              }
              if (th[1] == "A") {
                if (lastRow1[i]) {
                  lastRow1[i] = (parseFloat(lastRow1[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                  lastRow1[i] = "AVERAGE : " + Math.round((parseFloat(lastRow1[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                } else {
                  lastRow1[i] = "AVERAGE : " + parseFloat(obj[i]);
                }
              }
              if (th[2] == "A") {
                if (lastRow2[i]) {
                  lastRow2[i] = (parseFloat(lastRow2[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                  lastRow2[i] = "AVERAGE : " + Math.round((parseFloat(lastRow2[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                } else {
                  lastRow2[i] = "AVERAGE : " + parseFloat(obj[i]);
                }

              }
              if (th[3] == "A") {
                if (lastRow3[i]) {
                  lastRow3[i] = (parseFloat(lastRow3[i].split(":")[1]) * (parseFloat(tempAvgCount) - 1)) + parseFloat(obj[i]);
                  lastRow3[i] = "AVERAGE : " + Math.round((parseFloat(lastRow3[i]) / (parseFloat(tempAvgCount))) * 1000) / 1000;
                } else {
                  lastRow3[i] = "AVERAGE : " + parseFloat(obj[i]);
                }

              }
              if (th[1] == "C") {
                if (lastRow1[i]) {
                  lastRow1[i] = "COUNT : " + (parseFloat(lastRow1[i].split(":")[1]) + parseFloat("1"));
                } else {
                  lastRow1[i] = "COUNT : " + 1;
                }
              }
              if (th[2] == "C") {
                if (lastRow2[i]) {
                  lastRow2[i] = "COUNT : " + (parseFloat(lastRow2[i].split(":")[1]) + parseFloat("1"));
                } else {
                  lastRow2[i] = "COUNT : " + 1;
                }
              }
              if (th[3] == "C") {
                if (lastRow3[i]) {
                  lastRow3[i] = "COUNT : " + (parseFloat(lastRow3[i].split(":")[1]) + parseFloat("1"));
                } else {
                  lastRow3[i] = "COUNT : " + 1;
                }
              }
              tempAvgCount++;
            })
            var temp = this.horizontalTableData[i];
            var tot;
            var avg;
            var cal;

            if (th[1] == "T" || th[2] == "T" || th[3] == "T") {
              temp.forEach((obj1) => {
                if (tot) {
                  if (parseFloat(obj1)) {
                    tot = Math.round((parseFloat(tot) + parseFloat(obj1)) * 1000) / 1000;
                  }
                } else {
                  tot = parseFloat(obj1);
                }
              })
            }

            if (th[1] == "A" || th[2] == "A" || th[3] == "A") {
              var tempCountAvg = 1;
              temp.forEach((obj1) => {
                if (avg || avg == '0') {
                  avg = Math.round((((parseFloat(avg) * (tempCountAvg - 1)) + parseFloat(obj1)) / tempCountAvg) * 1000) / 1000;
                } else {
                  avg = parseFloat(obj1);
                }
                tempCountAvg++;
              })
            }

            if (th[1] == "C" || th[2] == "C" || th[3] == "C") {
              temp.forEach((obj1) => {
                if (cal) {
                  cal = parseFloat(cal) + 1;
                } else {
                  cal = 1;
                }
              })
            }
            if (tot) {
              temp.push("TOTAL : " + tot);
              tot = "";
            }
            if (avg) {
              temp.push(("AVERAGE : " + avg));
              avg = "";
            }
            if (cal) {
              temp.push(("COUNT : " + cal));
              cal = "";
            }
            if (parseFloat(th[1])) {
              this.hashIndex[i] = this.tableheader[i].split("#")[1];
            } else {
              this.hashIndex[i] = "NA";
            }
          } else {
            this.hashIndex[i] = this.tableheader[i].split("#")[1];
          }
          this.tableheader[i] = this.tableheader[i].split("#")[0];
        } else {
          this.hashIndex[i] = "NA";
          lastRow[i] = null;
        }
        if (lastRow1[i]) {
          lastRow[i] = lastRow1[i];
        }
        if (lastRow2[i]) {
          if (lastRow[i]) {
            lastRow[i] = lastRow[i] + " " + lastRow2[i];
          } else {
            lastRow[i] = lastRow2[i];
          }
        }
        if (lastRow3[i]) {
          if (lastRow[i]) {
            lastRow[i] = lastRow[i] + " " + lastRow3[i];
          } else {
            lastRow[i] = lastRow3[i];
          }
        }
      }
    }
    if (lastRow) {
      this.detailLabelData.push(lastRow);
    }
  }



  tableDesc(index, slNo) {
    if (slNo == 'PD') {
      var l_obj: any = [];
      l_obj.partyCode = this.accCodeVal[index];
      l_obj.seqNo = this.sp_obj.seq_no;
      this.navCtrl.push('PartyDetailsPage', { sp_obj: l_obj });
    } else {
      var value = this.detailLabelData[index];
      for (var i = 0; i < value.length; i++) {
        value[i] = value[i].replace('&', '^');
        this.columnName[i] = this.columnName[i].replace('&', '^');
      }
      var aa: any = {};
      if (this.sp_obj.valueFormat[0]) {
        aa = this.sp_obj.valueFormat[0];
      }
      aa.value = this.valueFormatVal;
      this.navCtrl.push('ReportDrillDownPage', {
        seq_no: this.sp_obj.seq_no,
        value: value.join("~"), slNo: slNo, columnName: this.columnName, valueFormat: aa, valueToSend: this.sp_obj.valueToSend
      });
    }

  }



  public chartClicked(e: any): void {
    var data = e.active[0];

    if (data) {
      var valueParam = data._chart.data.labels[data._index]
      var graphHeading = data._chart.data.labels[data._index]
      var gotoDrillDown = false;

      if (!(data._chart.canvas.id == "pie" || data._chart.canvas.id == "doughnut")) {
        graphHeading = this.labels[graphHeading - 1];
        for (let label of this.graphData.series) {
          if (label.indexOf("#") > -1) {
            if (label.split("#")[1] == graphHeading) {
              valueParam = label.split("#")[0];
              graphHeading = label.split("#")[1];
              gotoDrillDown = true;
            }
          }
        }
      } else {
        for (let label of this.graphData.series) {
          if (label.indexOf("#") > -1) {
            if (label.split("#")[1] == data._chart.data.labels[data._index]) {
              valueParam = label.split("#")[0];
              graphHeading = label.split("#")[1];
              gotoDrillDown = true;
            }
          }
        }
      }
      if (gotoDrillDown) {
        let reportgraphModal = this.modalCtrl.create('ReportGraphDrilldownPage', {
          graphTypeList: this.graphTypeList,
          obj: this.sp_obj, ChartData: this.ChartData, labels: this.labels, ChartOptions: this.ChartOptions,
          ChartLegend: this.ChartLegend, valueParam: valueParam, level: "1", graphHeading: graphHeading
        });
        reportgraphModal.present();
      }
    }
  }

  public chartHovered(e: any): void {
    console.log(e);
  }

  labels123: any = [];
  //Graph
  openPageByType(l_type) {
    this.ChartType = 'bar';
    var colors;
    var JSONvalue: any = [];
    JSONvalue.data = new Array();
    if (l_type == "Tabular") {
      this.flagForTypeChange = 4;
    } else if (l_type == "Graph" && (this.sp_obj.firstScreen == 'G')) {
      this.flagForTypeChange = 5;
      this.http.get(this.url + 'graphDetail?portletId=' + this.globalObjects.getLocallData("portlet_Id") + '&seqNo=' + this.sp_obj.seq_no).map(res => res.json()).subscribe(data => {
        for (let temp of data.graphDetail) {
          this.graphTypeList = temp.graphTypeList;
          this.series = temp.series;
          colors = temp.color;
          for (var i = 0; i < colors.length; i++) {
            var colors_item = colors[i];
            var border_item = colors[i];
            JSONvalue.data.push({
              backgroundColor: colors_item,
              borderColor: border_item,
            });
          }
          this.data = this.globalObjects.transpose(temp.graphdata);
          this.labels = ["JAN", "FEB", "MAR"];
          var l_length = Object.keys(this.data).length;
          this.aggregateData = this.globalObjects.aggregate((temp.graphdata), l_length);
        }
      }, err => { })
    } else if (l_type == "Graph" && (this.sp_obj.firstScreen == 'T')) {

      // if (this.flagforVerticleTable == 1) {
      //   this.graphTypeList = [{
      //     "graphType": "Bar Chart"
      //   }];
      // } else {
      //   this.graphTypeList = [{
      //     "graphType": "Bar Chart"
      //   }, {
      //     "graphType": "Line Chart"
      //   }, {
      //     "graphType": "Pie Chart"
      //   }, {
      //     "graphType": "Doughnut Chart"
      //   }, {
      //     "graphType": "Radar Chart"
      //   }, {
      //     "graphType": "Polar Chart"
      //   }, {
      //     "graphType": "base Chart"
      //   }];
      // }

      // for (let temp of this.l_graphData) {
      //   this.flagForTypeChange = 5;
      //   this.graphTypeList = [];

      //   this.data = [];
      //   var l_data = this.globalObjects.transpose(temp.graphLabelData);
      //   this.labels = [];
      //   var value_tosend = [];
      //   var i = 0;
      //   for (let obj of l_data) {
      //     if (i < this.noOfColumns) {
      //       if ((obj)) {
      //         value_tosend.push(obj);
      //         this.labels.push(temp.series[i].split("#")[0]);
      //       }
      //       i++
      //     }
      //   }
      //   var l_length = Object.keys(value_tosend).length;
      //   var aggregate = this.globalObjects.aggregate((value_tosend), l_length);
      //   this.data.push(aggregate);
      // }



      // alert("this.graphData--> " + this.graphData)
      this.labels = [];
      this.labels123 = [];
      this.ChartData = [];
      if (this.graphData.data) {
        this.flagForTypeChange = 5;
        var data = this.globalObjects.transpose(this.graphData.data);
        var count = 1;
        // this.labels = this.graphData.series;
        for (let obj of data) {
          this.ChartData.push({ data: obj, label: this.graphData.lable[count] })
          count++;
        }

        if (this.graphData.series) {
          for (let obj of this.graphData.series) {
            if (obj) {
              if (obj.indexOf("#") > -1) {
                var temp = obj.split("#");
                this.labels.push(temp[temp.length - 1]);
              } else {
                this.labels.push(obj);
              }
            }
          }
        }
        for (let obj in this.graphData.series) {
          this.labels123.push(parseInt(obj) + 1);
        }

      } else {
        this.flagForTypeChange = 6;
        // alert("graph data not avilble")
      }
    }
  }


  changeGraph(l_graphtype) {
    if (l_graphtype == "Pie Chart") {
      this.flagForPageChange = 2;
      this.ChartType = 'pie';
    } else if (l_graphtype == "Line Chart") {
      this.flagForPageChange = 3;
      this.ChartType = 'line';
    } else if (l_graphtype == "Bar Chart") {
      this.flagForPageChange = 1;
      this.ChartType = 'bar';
    } else if (l_graphtype == "Doughnut Chart") {
      this.flagForPageChange = 4;
      this.ChartType = 'doughnut';
    } else if (l_graphtype == "Radar Chart") {
      this.flagForPageChange = 5;
      this.ChartType = 'radar';
    } else if (l_graphtype == "Polar Chart") {
      this.flagForPageChange = 6;
      this.ChartData = this.ChartData[0].data;
      this.ChartType = 'polarArea';
    } else if (l_graphtype == "Horizontal Bar Chart") {
      this.flagForPageChange = 7;
      this.ChartType = 'horizontalBar';
    }
  }

  clearSearch() {
    this.searchEntity = '';
    this.searchFlag = false;
    this.ionViewDidLoad("clearData");
  }
  showRefreshReportData() {
    let reportDetailsModal = this.popoverCtrl.create('ReportDetailPage', { obj: this.sp_obj });
    reportDetailsModal.present();
  }
  // sortOrderby(index, data1) {
  //   this.currentFilter = data1;
  //   this.reverse = !this.reverse;
  //   var reverse = true;
  //   var temp = $filter('orderBy')(this.myTableData, index, reverse);
  //   this.myTableData = temp;
  //   this.detailLabelData = this.globalObjects.sortOrderby(index, data1,
  //     this.myTableData,this.detailLabelData);
  // }
  changeValueFormat(selectedFormat) {
    var tempValdata: any = [];
    this.valueFormatVal = selectedFormat;
    tempValdata = this.globalObjects.getLocallData("valueFormat");
    if (tempValdata) {
      for (let itemVal of tempValdata) {
        if (itemVal.seqId == this.sp_obj.seq_no) {
          itemVal.selectedFormat = selectedFormat;
        }
      }
    } else {
      tempValdata = [];
      tempValdata.push({ "seqId": this.sp_obj.seq_no, "selectedFormat": selectedFormat });
    }
    if (tempValdata) {
      this.globalObjects.setDataLocally("valueFormat", tempValdata);
    }
    this.pageCount = 0;
    this.ionViewDidLoad(selectedFormat);

  }

}


