import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalObjectsProvider } from '../global-objects/global-objects';
import { DatePipe } from '@angular/common';
import { HomePage } from '../../pages/home/home';
import { NavController } from 'ionic-angular/navigation/nav-controller';

@Injectable()
export class LocationEntryServicesProvider {

  constructor(public http: HttpClient, private globalObjects: GlobalObjectsProvider,private navCtrl:NavController) {
  }
  setinfo(fields, defaultPopulateData) {
    return new Promise((resolve, reject) => {
      var res: any = [];
      res.fieldsTH = [];
      res.rowsOfPopulateData = [];
      res.uploadEntryStatus = []
      var count = 0;
      for (let obj of fields) {
        var v = '';
        for (let key in obj) {
          if (key == 'column_desc') {
            v = obj[key];
          }
          if (key == "entry_by_user") {
            if (obj[key] == "T" || obj[key] == "R" && v !== '') {
              res.fieldsTH.push(v);
            }
          }
        }
      }

      res.fieldsTH.push("Upload Location");
      for (let key in defaultPopulateData) {
        res.defaultPopulateDataLength = Object.keys(defaultPopulateData[key]).length;
      }
      var tempdisable = true;

      for (var i = 0; i < res.defaultPopulateDataLength; i++) {
        for (let obj of fields) {
          var tempDefaultPopulateData = "";
          for (let key in defaultPopulateData) {
            if (key == obj.column_name) {
              tempDefaultPopulateData = defaultPopulateData[obj.column_name];
            }
          }
          if (obj.column_desc == "SLNO") {
            obj.value = i;
          } else {
            if (tempDefaultPopulateData == "undefined" || tempDefaultPopulateData == undefined || tempDefaultPopulateData == "") { } else {
              obj.value = tempDefaultPopulateData[i];
            }
          }
          if (obj.entry_by_user == "T" || obj.entry_by_user == "R") {
            if (tempdisable) {
              obj.entry_by_user = "T";

            } else {
              obj.entry_by_user = "R";
            }
          }

        }
        res.uploadEntryStatus[count] = 'F';
        count++;
        tempdisable = false;
        var tempCopy = JSON.parse(JSON.stringify(fields));
        res.rowsOfPopulateData.push(tempCopy);
      }
      resolve(res);
    })
  }
  uploadLocation(item, url, l_appSeqNo, l_userCode, l_base64VideoData) {

    return new Promise((resolve, reject) => {
      let key = "valueToSend";
      for (let obj of item) {
        if (obj.column_desc == "User Code" || obj.column_desc == "USER_CODE") {
          obj[key] = l_userCode;
        } else {
          if (obj.temp != null) {
            obj[key] = (obj.temp + "#" + obj.value);
          } else {
            if (obj.codeOfValue != null) {
              obj[key] = obj.codeOfValue;
            } else {
              obj[key] = obj.value;
            }
          }
        }
      }

      var l_record = {};
      var l_imgfile = {};
      var l_imgfiles = [];
      var l_fileCount = 1;
      var l_videoFile = {}
      var l_videoFiles = [];

      var orderList = [];

      for (let data of item) {
        let key = ""; // Variable 'key' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
        var value = ""; // Variable 'value' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY
        for (let key1 in data) {
          if (key1 == "column_name") {
            key = data[key1];
          }
          if (key1 == "valueToSend") {
            value = data[key1];
          }
        }

        if (data.column_type == "IMG") {
          l_record[key] = "";
          let l_v = key
          key = "fileId";
          l_imgfile[key] = l_v;
          key = "file";
          l_imgfile[key] = value;

          key = "fileName";
          value = "fileName" + l_fileCount;
          l_imgfile[key] = value;

          key = "desc";
          value = "desc" + l_fileCount;
          l_imgfile[key] = value;

          key = "sysFileName";
          value = "sysFileName" + l_fileCount;
          l_imgfile[key] = value;

          key = "imageTime";
          var datePipe = new DatePipe("en-US");

          value = datePipe.transform(new Date(), 'dd-MM-yyyy hh:mm:ss');
          l_imgfile[key] = value;

          l_imgfiles.push(l_imgfile);
          l_imgfile = {};
          l_fileCount++;
        } else {
          if (data.column_type == "VIDEO") {
            l_record[key] = "";
            let l_v = key
            key = "videoFileId";
            l_videoFile[key] = l_v;
            key = "videofile";
            l_videoFile[key] = l_base64VideoData;

            key = "videoFileName";
            value = "fileName" + l_fileCount;
            l_videoFile[key] = value;

            key = "videoDesc";
            value = "desc" + l_fileCount;
            l_videoFile[key] = value;

            key = "sysFileName";
            value = "sysFileName" + l_fileCount;
            l_videoFile[key] = value;

            l_videoFiles.push(l_videoFile);
            l_videoFile = {};
          } else {
            l_record[key] = value;
          }
        }
      }

      key = 'DYNAMIC_TABLE_SEQ_ID';
      value = l_appSeqNo;
      l_record[key] = value;

      var l_recordsInfo = [];
      l_recordsInfo.push(l_record)
      l_imgfiles.forEach(data => {
        l_recordsInfo.push(data)
      })

      l_videoFiles.forEach(data => {
        l_recordsInfo.push(data)
      })

      var l_DataToUpload = {};
      key = "recordsInfo";
      l_DataToUpload[key] = l_recordsInfo;

      var uploadUrl = url + 'addEntryDyanamically';

      var orderListToSend = {};
      key = "list";
      orderListToSend[key] = orderList;

      var fd = new FormData();
      fd.append('jsonString', JSON.stringify(l_DataToUpload));
      console.log("JSON STRING upload : " + JSON.stringify(l_DataToUpload));
      this.http.post(uploadUrl, fd, {
      }).subscribe(dataVal => {
        var data:any=[];
        data=dataVal;
        if (data.status == "insert data") {
          this.globalObjects.displayCordovaToast('Entry Saved Successfully..');
          this.navCtrl.setRoot(HomePage);
        } else {
          if (data.status == "updated data") {
            this.globalObjects.displayCordovaToast('Entry Updated Successfully..');
            this.navCtrl.setRoot(HomePage);
          } else {
            this.globalObjects.displayCordovaToast('Try again to add entry..');
          }
        }
        resolve(data.status);
      }, (err) => {
        reject(err);
      });

    })
  }
}
