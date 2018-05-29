import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { LoadingController, AlertController, ToastController } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { DatePipe } from '@angular/common';
import { PouchDBService } from '../pouchDB/pouchServies';
import { File } from '@ionic-native/file';
import 'rxjs/add/operator/map';
@Injectable()
export class GlobalObjectsProvider {
  online: boolean = true;
  loading: any;
  offlineFlag: boolean;
  url: any;
  platformVal: string;
  constructor(public http: Http, public loadingCtrl: LoadingController, private file: File, private toastCtrl: ToastController, private inAppBrowser: InAppBrowser, private alertCtrl: AlertController, public localNotification: PhonegapLocalNotification, public pouchDBService: PouchDBService) {
    this.url = this.getLocallData("scopeUrl");
    if (!this.url) {

      //Client Url TAGTEST
      // this.url="http://182.74.133.170:8080/DynamicAppWSV3/webService/TG/192.168.1.101/1521/TAGERP/TAGERP/";

      //Server Url
      var serverUrl = "http://192.168.100.195:9090/DynamicAppWS/webService/";
      // var serverUrl = "http://192.168.100.145:8080/DynamicAppWS/webService/";
      // var serverUrl = "http://192.168.100.157:8080/DynamicAppWS/webService/";
      //  var serverUrl = "http://192.168.100.146:8080/DynamicAppWS/webService/";
      // var serverUrl = "http://203.193.167.118:8888/DynamicAppWSV3/webService/";

      // var databaseUrl = "SS/192.168.100.173/1521/SSLERP/SSLERP/";
      // var databaseUrl = "SE/192.168.100.173/1521/SSELERP/SSELERP/";
      //  var databaseUrl = "MS/192.168.100.173/1521/MANERP/MANERP/";
      // var databaseUrl = "SM/192.168.100.10/1521/VDEMOERP/VDEMOERP/";
      // var databaseUrl = "SX/192.168.100.173/1521/SNXVERP/SNXVERP/";
      //  var databaseUrl = "SP/192.168.100.173/1521/SONIVERP/SONIVERP/";
      //var databaseUrl = "RE/192.168.100.173/1521/ROHASERP/ROHASERP/";
      // var databaseUrl = "RP/192.168.100.173/1521/RPSILERP/RPSILERP/";
      // var databaseUrl = "TG/192.168.100.173/1521/TAGTEST/TAGTEST/";
      // var databaseUrl = "VE/192.168.100.173/1521/VEEERP/VEEERP/";
      // var databaseUrl = "TG/192.168.100.173/1521/TAGERP/TAGERP/";
      // var databaseUrl = "MC/192.168.100.173/1521/MACLTEST/MACLTEST/";
      // var databaseUrl = "SS/192.168.100.173/1521/SMBHVERP/SMBHVERP/";
      // var databaseUrl = "JS/192.168.100.173/1521/JSPLERP/JSPLERP/";
      var databaseUrl = "JS/192.168.100.173/1521/SEPLERP/SEPLERP/";

      this.url = serverUrl + databaseUrl;
    }

  }
  setScopeUrl(url) {
    this.url = url;
  }
  getScopeUrl() {
    return this.url;
  }

  setPlatformValue(platformVal) {
    this.platformVal = platformVal;
  }
  getPlatformValue() {
    return this.platformVal;
  }

  setOnlineStatus(online) {
    this.online = online;
  }

  setOfflineFlag(flagVal) {
    this.offlineFlag = flagVal;
  }
  getOfflineFlag() {
    return this.offlineFlag;
  }
  setColumnDependentVal(fields, url, l_appSeqNo, column_name) {
    for (let obj of fields) {
      if (obj.column_validate) {
        var column_validate = obj.column_validate.split("#");
        var column_validateValue = column_validate
        fields.forEach(function (obj) {
          if (column_validate.indexOf(obj.column_name) > -1) {
            if (obj.codeOfValue) {
              column_validateValue[column_validate.indexOf(obj.column_name)] = obj.codeOfValue;
            } else {
              column_validateValue[column_validate.indexOf(obj.column_name)] = obj.value;
            }
          }
        })
        if (column_name == obj.column_name) {
          this.http.get(url + 'validateValue?SeqNo=' + l_appSeqNo + "&colSLNO=" + obj.slno + "&valueToValidate=" + encodeURIComponent(obj.value))
            .subscribe(res => {
              var data: any = res
              var splitVal = data.validatedMsg.split("#");
              if (splitVal[0] == "T") {
              } else if (splitVal[0] == "F") {
                let alertVal = this.showAlert(splitVal[1]);
                alertVal.present();
                obj.value = "";
              }
            })
        }
      }
    }
  }

  getOnlineStatus() {
    return this.online;
  }

  showLoading() {
    if (!this.loading) {
      this.loading = this.loadingCtrl.create({
        content: 'Please Wait...'
      });
      this.loading.present();
    }
  }

  hideLoading() {
    if (this.loading) {
      this.loading.dismiss();
      this.loading = null;
    }
  }
  showAlert(msg) {
    let shwAlert = this.alertCtrl.create({
      title: '',
      message: msg,
      buttons: ['OK']
    })
    return shwAlert;
  }
  openWebpage(url: string) {
    const options: InAppBrowserOptions = { zoom: 'no' }
    this.inAppBrowser.create(url, '_self', options);
  }
  callLocalNotification(l_aapType, l_userCode) {
    this.http.get(this.getScopeUrl() + 'notification?userCode=' + l_userCode + "&seqNo=55").
      map(res => res.json()).subscribe(data => {
        var idcount = 1;
        var done = true;
        var isUnread = "no"
        if (data.model) {
          for (let obj of data.model) {
            var alarmTime = new Date();
            alarmTime.setSeconds(alarmTime.getSeconds() + ((idcount) + 2));
            if (idcount == 9) {
              done = true;
            }
            this.localNotification.requestPermission().then(
              (permission) => {
                if (permission === 'granted') {
                  this.localNotification.create(obj.col5, {
                    tag: obj.col5,
                    body: obj.col6
                  });
                }
              })

            idcount = idcount + 1;
            obj.isRead = "no";
            isUnread = "yes"
          }
        } else {
          isUnread = "no"
        }
        this.storeNotificationDataInPDB(data.model, isUnread);
      })
  }

  storeNotificationDataInPDB(dataModel, isUnread) {
    var temp: any = {};
    var id = "localNotif";
    this.pouchDBService.getObject(id).then((dd) => {
      temp = dd;
      for (let obj1 of dataModel) {
        var isUpdate = false;
        for (let obj of temp.notifList) {

          if (obj1.seq_id == obj.seq_id) {
            obj.col5 = obj1.col5;
            obj.col6 = obj1.col6;
            obj.col9 = obj1.col9;
            obj.lastupdate = obj1.lastupdate;
            obj.actionType = obj1.actionType;
            obj = obj1;
            isUpdate = true;
          }
        }
        if (!isUpdate) {
          temp.notifList.push(obj1);
        }
      }
      // For ERP Approval to separed approved and un approved 
      // var active = [];
      // var notActive = [];
      //   for (let obj of temp.notifList) {
      //   if (obj.actionType == 'A') {
      //     active.push(obj);
      //   } else if (obj.actionType == 'NA') {
      //     notActive.push(obj);
      //   }
      // }
      // temp.notifList = active;
      temp.isUnread = isUnread;
      this.pouchDBService.updateJSON(temp);
    }, (err) => {
      if (dataModel) {
        temp.notifList = dataModel;
      }
      temp._id = id;
      temp.isUnread = isUnread;
      this.pouchDBService.updateJSON(temp);
    })
  }

  confirmationPopup(message) {
    let alert = this.alertCtrl.create({
      title: 'Confirmation',
      message: message,
      buttons: [
        {
          text: 'CANCEL',
          role: 'cancel',
          handler: () => {
            alert.dismiss(false);
            return false;
          }
        },
        {
          text: 'OK',
          handler: (data) => {
            alert.dismiss(true);
            return false;
          }
        }
      ]
    });

    return alert;
  }

  transpose(temp) {
    var tempLength = temp.length ? temp.length : 0,
      arrLength = temp[0] instanceof Array ? temp[0].length : 0;
    if (arrLength === 0 || tempLength === 0) {
      return [];
    }
    var i, j, tempArray = [];
    for (i = 0; i < arrLength; i++) {
      tempArray[i] = [];
      for (j = 0; j < tempLength; j++) {
        tempArray[i][j] = temp[j][i];
      }
    }
    return tempArray;
  }
  displayErrorMessage(status) {
    var message = '';
    if (status === 404 || status === -1) {
      message = "Resource not available..";
    } else if (status == 400) {
      message = "Invalid request..";
    } else if (status == 500) {
      message = "Server is busy..";
    } else {
      message = "Try Again..";
    }
    this.displayCordovaToast(message)
  }
  displayCordovaToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 5000,
      position: 'bottom'
    });
    toast.present();
  }

  formatDate(date, format) {
    var datePipe = new DatePipe("en-US");
    var date1;
    try {
      date1 = new Date(date);
      return datePipe.transform(date1, format);
    } catch (err) {
      date1 = new Date();
      return datePipe.transform(date1, format);
    }

  }
  goBack(p) {
  }
  getDate(key) {
    var f;
    if (key == "Beginning of Year") {
      if ((new Date().getMonth()) > 2) {
        f = new Date((new Date().getFullYear()), 3, 1);
      } else {
        f = new Date((new Date().getFullYear() - 1), 3, 1);
      }
      f = this.formatDate(f, "dd-MM-yyyy");
    }
    if (key == "Beginning of Qtr year") {
      f = new Date(new Date().getTime() + (-90 * 24 * 60 * 60 * 1000));
      f = this.formatDate(f, "dd-MM-yyyy");

    }
    if (key == "Beginning of Month") {
      f = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      f = this.formatDate(f, "dd-MM-yyyy");
    }
    return f;
  }

  aggregate(data, length) {
    var aggregateArray = [],
      i = 0,
      sum = 0,
      j = 0;
    var arrLength = Object.keys(data[0]).length;
    for (i = 0; i < length; i++) {
      for (j = 0; j < arrLength; j++) {
        sum += Math.round(data[i][j]);
      }
      var avg = Math.round(sum / arrLength);
      aggregateArray.push(avg);
      sum = 0;
    }
    return aggregateArray;
  }

  deleteEachRow(tableData, index) {
    tableData.splice(index, 1);
    return tableData;
  }

  savebase64AsImageFile(base64, name, folderpath) {
    let blob: Blob = this.b64toBlob("data:image/jpeg;base64," + base64);
    this.file.writeFile(folderpath, name, blob).then(result => {
    })
      .catch((err) => {
      })
  }

  b64toBlob(b64Data) {
    let contentType = b64Data.split(',')[0].split(':')[1].split(';')[0] || '';
    var sliceSize = 1024;
    var byteCharacters = atob(b64Data.split(',')[1]);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);
      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      var byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: contentType });
  }

  //Authservice

  setDataLocally(key, value) {
    return localStorage.setItem(key, JSON.stringify(value));
  }
  getLocallData(key) {
    return JSON.parse(localStorage.getItem(key));
  }
  destroyLocalData(key: string) {
    this.pouchDBService.getObject("sessionColumn12").then((data) => {
      this.pouchDBService.deleteJSON(data).then(data => {
      }, err => { })
    }, err => {
    })
    return localStorage.removeItem(key);
  }

}