import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';
/**
 * Generated class for the ReportGraphDrilldownPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-summary-report',
  templateUrl: 'report-graph-drilldown.html',
})
export class ReportGraphDrilldownPage {

  graphTypeList: any;
  sp_obj: any;
  ChartData: any;
  labels: any = [];
  ChartOptions: any;
  ChartLegend: any;
  selectedChart: any;
  url: any;
  login_params: any;
  graphHeading: String;
  valueParam: any;
  lableSeries: any;
  labels123: any = [];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public modalCtrl: ModalController,
    public globalObjects: GlobalObjectsProvider, public httpClient: HttpClient, ) {
    this.selectedChart = 'Bar Chart'
    this.sp_obj = this.navParams.get("obj");
    // this.ChartData = this.navParams.get("ChartData");
    // this.labels = this.navParams.get("labels");
    this.ChartOptions = this.navParams.get("ChartOptions");
    this.ChartLegend = this.navParams.get("ChartLegend");
    this.graphTypeList = this.navParams.get("graphTypeList");
    this.url = this.globalObjects.getScopeUrl();
    this.login_params = this.globalObjects.getLocallData("userDetails");
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportGraphDrilldownPage');
    this.valueParam = this.navParams.get("valueParam");
    this.graphHeading = this.navParams.get("graphHeading");

    var url = this.url + "graphDrillDown?seqNo=" + this.sp_obj.seq_no + '&userCode=' + this.login_params.user_code
      + "&valueFormat=&valueParam=" + encodeURIComponent(this.valueParam) + "&level=" + this.navParams.get("level");
    console.log(url);
    this.httpClient.get(url).subscribe(resdata => {
      var data: any = resdata;
      this.ChartData = [];
      if (data.graphData) {
        var chartdata = this.globalObjects.transpose(data.graphData.data);
        var count = 1;
        this.lableSeries = data.graphData.series;
        for (let obj of chartdata) {
          this.ChartData.push({ data: obj, label: data.graphData.lable[count] })
          count++;
        }

        console.log(this.ChartData)

        if (data.graphData.series) {
          for (let obj of data.graphData.series) {
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
        for (let obj in data.graphData.series) {
          this.labels123.push(parseInt(obj) + 1);
        }
      }
    })

  }

  public chartClicked(e: any): void {
    var data = e.active[0];
    if (data) {
      var valueParam = data._chart.data.labels[data._index]
      var graphHeading = data._chart.data.labels[data._index]
      var gotoDrillDown = false;
      graphHeading = this.labels[graphHeading - 1];
      for (let label of this.lableSeries) {
        if (label.indexOf("#") > -1) {
          if (label.split("#")[1] != "") {
            if (label.split("#")[1] == graphHeading) {
              valueParam = label.split("#")[0];
              graphHeading = label.split("#")[1];
              gotoDrillDown = true;
            }
          }
        }
      }



      // var valueParam = data._model.label
      // var graphHeading = data._model.label
      // var gotoDrillDown = false;

      // for (let label of this.lableSeries) {
      //   if (label.indexOf("#") > -1) {
      //     if (label.split("#")[1] == data._model.label) {
      //       valueParam = label.split("#")[0];
      //       graphHeading = label.split("#")[1];
      //       gotoDrillDown = true;
      //     }
      //   }
      // }

      valueParam = this.valueParam + "#" + valueParam;
      if (gotoDrillDown) {
        let reportgraphModal = this.modalCtrl.create('ReportGraphDrilldownPage', {
          graphTypeList: this.graphTypeList,
          obj: this.sp_obj, ChartData: this.ChartData, labels: this.labels, ChartOptions: this.ChartOptions,
          ChartLegend: this.ChartLegend, valueParam: valueParam, level: 2, graphHeading: graphHeading
        });
        reportgraphModal.present();
      }

    }
  }
}
