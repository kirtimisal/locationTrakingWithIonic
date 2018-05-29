import { Component } from '@angular/core';
import {  NavController, NavParams, ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';

@IonicPage()
@Component({
  selector: 'page-grid-details-modal',
  templateUrl: 'grid-details-modal.html',
})
export class GridDetailsModalPage {
  gridDetails: any = {};
  fields: any;
  l_appSeqNo: any;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, public globalObjects: GlobalObjectsProvider, public httpClient: HttpClient) {
    this.gridDetails = navParams.get('paramValue');
    this.fields = navParams.get('fields');
    this.l_appSeqNo = navParams.get('l_appSeqNo');
    var value = this.gridDetails.value;
    if (this.gridDetails.query_dependent_row) {
      var qdr = this.gridDetails.query_dependent_row.split('#');
      var qdr_value = qdr;
      for (let obj of this.fields) {
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

    var l_url = this.globalObjects.getScopeUrl() + 'getDetailInformation?forWhichcolmn=' + this.gridDetails.column_name
      + '&uniquKey=' + this.l_appSeqNo + '&whereClauseValue=' + encodeURIComponent(value);

    this.httpClient.get(l_url).subscribe(resdata => {
      var data: any = resdata;
      this.gridDetails.message = data.message;
      this.gridDetails.status = data.status;
      var head = [];
      var row = [];
      if (data.defaultPopulateData) {
        for (let key in data.defaultPopulateData) {
          head.push(key);
          row.push(data.defaultPopulateData[key]);
        };
        this.gridDetails.dropdownList = {};
        this.gridDetails.dropdownList.rows = this.globalObjects.transpose(row);
        this.gridDetails.dropdownList.headers = head;
      } else {
        this.gridDetails.message = "Data Not Available";
        this.gridDetails.status = "error";
      }

    }, err => {
      this.gridDetails.message = "Data Not Available";
      this.gridDetails.status = "error";
    })
  }

  closeLov() {
    this.viewCtrl.dismiss(this.fields);
  }

}
