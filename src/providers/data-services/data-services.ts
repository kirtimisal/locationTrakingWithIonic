import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GlobalObjectsProvider } from '../global-objects/global-objects';
import { PouchDBService } from '../pouchDB/pouchServies';
import { File } from '@ionic-native/file';

@Injectable()
export class DataServicesProvider {
  l_aapType
  userDetails;
  base_url;
  _id;
  constructor(public http: HttpClient, public globalObject: GlobalObjectsProvider, private file: File, public pouchDBService: PouchDBService) {
    console.log('Hello DataServicesProvider Provider');
    this.l_aapType = this.globalObject.getLocallData('apptype');
    this.userDetails = this.globalObject.getLocallData('userDetails');
    this.base_url = this.globalObject.getScopeUrl();
  }

  setOfflineAppData() {
    return new Promise((resolve, reject) => {
      this.http.get(this.base_url + 'offlineFormInfo?apptype=' + this.l_aapType + '&userCode=' + this.userDetails.user_code).subscribe(dataVal => {
        var data: any = [];
        data = JSON.parse(JSON.stringify(dataVal));
        var OfflineData = data.offlineFormInfo;
        var table_Detail = OfflineData.table_Detail;
        var view_mode = OfflineData.view_mode
        var addFormData = OfflineData.addFormData;
        let temp: any = {};
        this.pouchDBService.getObject(this.l_aapType).then(data => {
          temp = data;
          temp.table_Detail = table_Detail;
          temp.view_mode = view_mode
          this.pouchDBService.put(this.l_aapType, temp);
        }, err => {
          temp.table_Detail = table_Detail;
          temp._id = this.l_aapType + '';
          temp.view_mode = view_mode
          this.pouchDBService.put(this.l_aapType, temp);
        })
        for (let i = 0; i < addFormData.length; i++) {
          var obj = addFormData[i];
          var count = 0;
          let temp1: any = {};
          this.pouchDBService.getObject(obj.seqNo + "").then(data => {
            temp1 = data;
            obj = addFormData[count];
            temp1.recordsInfo = obj.recordsInfo;
            temp1.defaultPopulateData = obj.defaultPopulateData;
            this.pouchDBService.put(obj.seqNo + "", temp1);
            count++;
          }, err => {
            if (err) {
              err = false;
              for (var j = 0; j < addFormData.length; j++) {
                var obj1 = addFormData[j];
                var temp2: any = {};
                temp2._id = obj1.seqNo + "";
                temp2.defaultPopulateData = obj1.defaultPopulateData;
                temp2.recordsInfo = obj1.recordsInfo
                this.pouchDBService.put(obj.seqNo + "", temp2);
              }
            }
          })
        }
        resolve();
      }, err => {
        reject(err);
      });
    })
  }
  setOfflineDashbordData(table_Detail, view_mode, l_aapType) {
    let temp: any = {};
    this.pouchDBService.getObject(l_aapType + "_seqNo").then(data => {
      temp = data;
      temp.id = l_aapType + "_seqNo";
      temp.table_Detail = table_Detail;
      temp.view_mode = view_mode
      this.pouchDBService.put(l_aapType + "_seqNo", temp);
    }, err => {
      temp.table_Detail = table_Detail;
      temp.id = l_aapType + "_seqNo";
      temp.view_mode = view_mode;
      this.pouchDBService.put(l_aapType + "_seqNo", temp);
    })

  }

  storeSessionColumn1(value) {
    return new Promise((resolve, reject) => {
      let temp: any = {};
      var sessionColumn: any = [];
      this.pouchDBService.getObject("sessionColumn12").then((data) => {
        temp = data;
        sessionColumn = value;
        var itemFound = false;
        for (let obj1 of sessionColumn) {
          itemFound = false;
          for (let obj of temp.data) {
            if (obj1.column_name == obj.column_name) {
              obj.value = obj1.value;
              obj.codeOfValue = obj1.codeOfValue;
              itemFound = true;
            }
          }
          if (!itemFound) {
            temp.data.push(obj1);
          }
        }
        this.pouchDBService.put('sessionColumn12', temp);
        resolve("success");
      }, (err) => {
        temp._id = "sessionColumn12";
        temp.data = value;
        this.pouchDBService.put('sessionColumn12', temp);
        resolve("success");
      })

    })
  }

  setOfflineForm(seqNo, data) {
    return new Promise((resolve, reject) => {
      let temp1: any = {};
      this.pouchDBService.getObject(seqNo + "_seqNo").then(dataObj => {
        temp1 = dataObj;
        temp1._id = seqNo + "_seqNo";
        temp1.recordsInfo = data.recordsInfo;
        temp1.defaultPopulateData = data.defaultPopulateData;
        this.pouchDBService.put(seqNo + "_seqNo", temp1).then(idd => {
          resolve(idd);
        });
      }, err => {
        temp1._id = seqNo + "_seqNo";
        temp1.defaultPopulateData = data.defaultPopulateData;
        temp1.recordsInfo = data.recordsInfo;
        this.pouchDBService.put(seqNo + "_seqNo", temp1).then(idd => {
          resolve(idd);
        });
      })
    })
  }

  setOfflineDefaultPopulatedData(seqNo, data, searchId) {
    return new Promise((resolve, reject) => {
      let temp1: any = {};
      this.pouchDBService.getObject(seqNo + "_seqNo").then(dataObj => {
        temp1 = dataObj;
        temp1.defaultPopulateData[searchId] = data.defaultPopulateData;
        this.pouchDBService.put(seqNo + "_seqNo", temp1).then(idd => {
          resolve("success");
        });
      }, err => {
        temp1._id = seqNo + "";
        temp1.defaultPopulateData = {},
          temp1.defaultPopulateData[searchId] = data.defaultPopulateData;
        temp1.recordsInfo = data.recordsInfo;
        this.pouchDBService.put(seqNo + "_seqNo", temp1).then(idd => {
          resolve("success");
        });
      })
    })
  }

  storeLOV(lov, id) {
    return new Promise((resolve, reject) => {
      var JSON: any = {};
      this._id = "lov" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.lov = lov;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => {
        JSON._id = this._id;
        JSON.lov = lov;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      })
    })
  }
  addEntryToLoacalDB(fieldsData, l_appSeqNo, fieldsTH1, defaultPopulateDataLength, uploadEntryStatus, entryType) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.entryList.push(fieldsData);
        console.log(JSON.entryList);
        JSON.count = JSON.entryList.length;
        JSON.fieldsTH = fieldsTH1;
        JSON.defaultPopulateDataLength = defaultPopulateDataLength;
        JSON.uploadEntryStatus = uploadEntryStatus,
          JSON.entryType = entryType;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => {
        JSON._id = this._id;
        JSON.entryList = [];
        JSON.entryList.push(fieldsData);
        JSON.count = JSON.entryList.length;
        JSON.fieldsTH = fieldsTH1;
        JSON.defaultPopulateDataLength = defaultPopulateDataLength;
        JSON.uploadEntryStatus = uploadEntryStatus;
        JSON.entryType = entryType;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      })
    })
  }

  addOrderEntryToLoacalDB(fieldsData, l_appSeqNo, entryType, index, l_dateTime) {
    let headEntry;
    let orderEntry
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        if (entryType == "headEntry") {
          headEntry = fieldsData;
          orderEntry = "";
          var tempDate = { column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: l_dateTime }
          JSON.entryList.push({ headEntry: headEntry, orderEntry: orderEntry, DATE: tempDate });
        }
        if (entryType == "orderEntry") {
          let temp = JSON.entryList[index];
          temp.orderEntry = fieldsData;
          JSON.entryList.splice(index, 1, temp);
        }
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve((JSON.count - 1));
      }, err => {
        JSON._id = this._id;
        JSON.entryList = [];
        if (entryType == "headEntry") {
          headEntry = fieldsData;
          orderEntry = "";
          let date = this.globalObject.formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss');
          let tempDate = { column_desc: "DATE", column_name: "DATE", column_type: "DATE", entry_by_user: "F", value: date }
          JSON.entryList.push({ headEntry: headEntry, orderEntry: orderEntry, DATE: tempDate });
        }
        if (entryType == "orderEntry") {
          let temp = JSON.entryList[index];
          temp.orderEntry = fieldsData;
          JSON.entryList.splice(index, 1, temp);
        }
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve((JSON.count - 1));
      })
    })
  }

  updateEntryToLoacalDB(fieldsData, l_appSeqNo, index) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.entryList.splice(index, 1, fieldsData);
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  updateLocPopEntryToLoacalDB(fieldsData, l_appSeqNo, index, uploadEntryStatus) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.entryList.splice(index, 1, fieldsData);
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  updateOrderEntryToLoacalDB(fieldsData, l_appSeqNo, index, tempAppSeqNo, entryType) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON1: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON1 = data;
        if (entryType == "headEntry") {
          let temp = JSON1.entryList[index];
          temp.headEntry = fieldsData;
          temp.orderEntry = temp.orderEntry;
          JSON1.entryList.splice(index, 1, temp);
        }
        if (entryType == "orderEntry") {
          let temp = JSON1.entryList[index];
          temp.headEntry = temp.headEntry;
          temp.orderEntry = fieldsData;
          JSON1.entryList.splice(index, 1, temp);
        }
        JSON1.count = JSON1.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve((JSON1.count - 1));
      }, err => { reject('error') })
    })
  }

  deleteEntry(item, l_appSeqNo, index) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.entryList.splice(index, 1);
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }
  deleteOrderPopulatedEntry(l_appSeqNo, index, seq_id) {
    return new Promise(function (resolve, reject) {
    })
  }

  deleteAllEntry(l_appSeqNo) {
    return new Promise((resolve, reject) => {
      var id = l_appSeqNo.toString();
      var JSON: any = {};
      this._id = "entrySeqNo" + id;
      this.pouchDBService.getObject(this._id).then(data => {
        JSON = data;
        JSON.entryList = [];
        JSON.count = JSON.entryList.length;
        this.pouchDBService.put(this._id, JSON);
        resolve("sucess");
      }, err => { reject('error') })
    })
  }

  uploadEntry(fieldsData, l_appSeqNo, url, l_latitude, l_longitude, l_location,
    entryType, seqId, dependent_next_entry_seq, update_key, update_key_Value, update_key_codeOfValue, l_base64VideoData) {
    return new Promise((resolve, reject) => {
      var l_record = {};
      var l_imgfile = {};
      var l_imgfiles = [];
      var l_fileCount = 1;
      var l_videoFile = {}
      var l_videoFiles = [];
      var imageSaveFlag = false;
      var colNameVal = "";
      var collName = "";
      let directoryPath = "";
      let platformVal = this.globalObject.getPlatformValue();
      if (platformVal) {
        if (platformVal == 'ios') {
          directoryPath = this.file.documentsDirectory;
        } else {
          directoryPath = this.file.externalRootDirectory;
        }
      } else {
        directoryPath = this.file.externalRootDirectory;
      }
      for (let data of fieldsData) {
        if (data.column_type == "IMG") {
          imageSaveFlag = false;
          colNameVal = "";
          collName = "";
          if (data.column_default_value) {
            if (data.column_default_value.indexOf("#~") > -1) {
              imageSaveFlag = true;
              var splitUrl: any;
              var splitVal = data.column_default_value.split('~');
              if (splitVal[1]) {
                splitUrl = splitVal[1].split("@");
                if (splitUrl[1]) {
                  if (splitUrl[1].indexOf("#") > -1) {
                    var spliCol = splitUrl[1].split("#");
                    colNameVal = "_" + spliCol[1];
                    collName = spliCol[0]
                  } else {
                    colNameVal = "";
                    collName = splitUrl[1];
                  }
                }
              }
              var fval = [];
              var flderFvalName = "";
              var folderNameval = [];
              var filename = "";
              var tempVal = [];
              if (splitUrl[0]) {
                if (splitUrl[0].indexOf(",") > -1) {
                  for (let obj2 of fieldsData) {
                    if (obj2.column_name == collName) {
                      filename = obj2.value;
                      filename = filename + colNameVal;
                      if (filename) {
                      } else {
                        filename = this.globalObject.formatDate((new Date()), 'dd-MM-yyyy HH:mm:ss');
                      }
                    }
                  }
                  folderNameval = splitUrl[0].split(",");
                  var flgVal = "true";
                  for (let i = 0; i < folderNameval.length; i++) {
                    if (flgVal == "false") {
                      var Ival = i - 1;
                      fval.push(folderNameval[Ival]);
                    }
                    if (folderNameval[i]) {
                      for (let obj3 of fieldsData) {
                        if (folderNameval[i] == obj3.column_name) {
                          fval.push(obj3.value);
                          flgVal = "done";
                        } else {
                          if (flgVal == "done") {
                          } else {
                            flgVal = "false";
                          }
                        }
                      }
                    }
                  }
                  if (fval) {
                    data.flderFvalName = "";
                    var fnm = "";
                    var path = "";
                    for (let i = 0; i < fval.length; i++) {
                      if (i > 0) {
                        fnm += fval[i - 1] + "/";
                      }
                      data.flderFvalName += fval[i] + "/";
                      flderFvalName += fval[i] + "/";
                      if (i == 0) {
                        path =directoryPath;
                      } else {
                        path = directoryPath+ "/" + fnm;
                      }
                      tempVal.push({ path: path, value: fval[i] });
                    }
                  }
                  if (tempVal) {
                    let i = 0;
                    this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                      i++;
                      if (i <= tempVal.length) {
                        this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                          i++;
                          if (i <= tempVal.length) {
                            this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                              i++;
                              this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                              }, (err) => { });
                            }, (err) => { });
                          }
                        }, (err) => { });
                      }
                    }, (err) => {
                      i++;
                      if (i <= tempVal.length) {
                        this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                          i++;
                          if (i <= tempVal.length) {
                            this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                              i++;
                              this.createDir(tempVal[i].path, tempVal[i].value).then(result => {
                              }, (err) => { });
                            }, (err) => { });
                          }
                        }, (err) => { });
                      }
                    });
                  }
                  data.filenameVal = filename;
                }
              }
            }
          }
        }

        if (data.column_desc && data.column_desc.indexOf(".") > -1) { } else {
          var key = ""; //  used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
          var value = ""; // used to denote key value pair, for generating dynamic JSON for ADD_ENTRY
          for (let keyval in data) {
            if (keyval == "column_name") {
              key = data[keyval]
            } else {
              if (keyval == "valueToSend") {
                value = data[keyval]
              }
            }
          }
          if (data.column_type == "IMG" && imageSaveFlag == false) {
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

            if (data.column_select_list_value) {
              var pathva = data.column_select_list_value;
              for (let obj of fieldsData) {
                if (pathva.indexOf(obj.column_name) > -1) {
                  pathva = pathva.split(obj.column_name).join(obj.valueToSend);
                }
              }
              value = pathva;
              l_imgfile[key] = value;
            } else {
              value = "sysFileName" + l_fileCount;
              l_imgfile[key] = value;
            }

            key = "imageTime";
            // value = new Date().toString();
            value = this.globalObject.formatDate(new Date().toDateString(), 'dd-MM-yyyy hh:mm:ss')
            if (entryType == "Update" || entryType == "Q" || entryType == "H") {
              if (data.textOverLay == "T") {
                l_imgfile[key] = value + '~~' + 'T';
              } else {
                l_imgfile[key] = value + '~~' + 'F';
              }
            } else {
              l_imgfile[key] = value
            }
            l_imgfiles.push(l_imgfile);
            l_imgfile = {};
            l_fileCount++;
          } else {
            if (data.column_type == "VIDEO") {
              l_record[key] = "";
              let l_v = key;
              key = "videoFileId";
              l_videoFile[key] = l_v;
              key = "videofile";
              l_videoFile[key] = data.value;

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
              if (data.column_type == "BUTTON") {
                l_record[key] = data.column_desc;
              } else {
                l_record[key] = value;
              }
            }
          }
        }
      }
      var uploadUrl: any;
      key = 'DYNAMIC_TABLE_SEQ_ID';
      if (dependent_next_entry_seq != null) {
        value = dependent_next_entry_seq;
      } else {
        value = l_appSeqNo;
      }
      l_record[key] = value;
      if (entryType == "Update") {
        uploadUrl = url + 'updateEntryInfo';
        key = update_key;
        if (update_key_codeOfValue) {
          value = update_key_codeOfValue
        } else {
          value = update_key_Value;
        }
        l_record[key] = value;
      } else {
        if (entryType == "Q" || entryType == "H") {
          key = update_key;
          if (update_key_codeOfValue) {
            value = update_key_codeOfValue
          } else {
            value = update_key_Value;
          }
          l_record[key] = value;
          uploadUrl = url + 'updateEntryInfo';
        } else {
          uploadUrl = url + 'addEntryDyanamically';
        }
      }

      if (entryType == "H") {
        uploadUrl = url + 'documentMng';
      }

      var l_recordsInfo = [];
      l_recordsInfo.push(l_record)
      for (let data of l_imgfiles) {
        l_recordsInfo.push(data)
      }
      for (let data of l_videoFiles) {
        l_recordsInfo.push(data)
      }

      var l_DataToUpload = {};
      key = "recordsInfo";
      l_DataToUpload[key] = l_recordsInfo;

      var fd = new FormData();
      fd.append('jsonString', JSON.stringify(l_DataToUpload))
      if (l_latitude == "offlineEntry") {
        fd.append('flag', "off");
      }
      console.log("JSON STRING : " + JSON.stringify(l_DataToUpload));
      this.http.post(uploadUrl, fd, {
      }).subscribe(res => {
        for (let data of fieldsData) {
          if (data.column_type == "IMG") {
            if (data.column_default_value) {
              if (data.column_default_value.indexOf("#~") > -1) {
                var folderpath = directoryPath + data.flderFvalName;
                this.globalObject.savebase64AsImageFile(data.value, data.filenameVal + ".jpg", folderpath);
              }
            }
          }
        }
        resolve(res);
      }, (err) => {
        reject(err);
      });
    })
  }
  createDir(path, value) {
    return new Promise((resolve, reject) => {
      this.file.createDir(path, value, true).then(result => {
        resolve("success")
      }, (err) => {
        resolve("success")
      })
    })
  }
  uploadAllEntry(listOfEntry, l_appSeqNo, url, type) {
    return new Promise((resolve, reject) => {
      var l_record = {};
      var l_imgfile = {};
      var l_imgfiles = [];
      var l_fileCount = 1;
      var l_videoFiles = [];
      var tempChecked = "T";
      var orderList = [];
      var imageSaveFlag = false;
      var key;
      var value;
      for (let obj1 of listOfEntry) {
        if (obj1.column_type == "DATE") {
          tempChecked = "F";
        } else {
          for (let data of obj1) {
            if (data.column_desc && data.column_desc.indexOf(".") > -1) { } else {
              // var key = ""; // Variable 'key' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY 
              // var value = ""; // Variable 'value' is used to denote key value pair, for generating dynamic JSON for ADD_ENTRY
              for (let keyval in data) {
                if (keyval == "column_name") {
                  key = data[keyval]
                } else {
                  if (keyval == "valueToSend" || keyval == "value") {
                    value = data[keyval]
                  }
                }
              }

              if (data.column_type == "IMG" && imageSaveFlag == false) {
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
                value = this.globalObject.formatDate(new Date().toDateString(), 'dd-MM-yyyy hh:mm:ss');
                l_imgfile[key] = value;

                l_imgfiles.push(l_imgfile);
                l_imgfile = {};
                l_fileCount++;
              } else {
                if (data.column_type == "VIDEO") {
                } else {
                  l_record[key] = value;
                }
              }
            }
          }

          key = 'DYNAMIC_TABLE_SEQ_ID';
          value = l_appSeqNo;
          l_record[key] = value;

          var l_recordsInfo = [];
          l_recordsInfo.push(l_record)
          for (let data of l_imgfiles) {
            l_recordsInfo.push(data)
          }
          for (let data of l_videoFiles) {
            l_recordsInfo.push(data)
          }

          var l_DataToUpload = {};
          key = "recordsInfo";
          l_DataToUpload[key] = l_recordsInfo;

          var tempCopy = JSON.parse(JSON.stringify(l_DataToUpload))
          orderList.push(tempCopy);
          tempChecked = 'F';
        }

      }

      var uploadUrl = url + 'addMultipleEntry';

      var orderListToSend = {};
      key = "list";
      orderListToSend[key] = orderList;

      var fd = new FormData();
      fd.append('jsonString', JSON.stringify(orderListToSend));
      if (type == "offlineEntry") {
        fd.append('flag', "off");
      }
      console.log("JSON STRING : " + JSON.stringify(orderListToSend));
      this.http.post(uploadUrl, fd, {
      }).subscribe(res => {
        resolve(res);
      }, (err) => {
        reject(err);
      });
    })
  }
  getEntryFromData(l_url, l_appSeqNo) {
    return new Promise((resolve, reject) => {
      this.http.get(l_url).subscribe(data => {
        var a: any = [];
        a = JSON.parse(JSON.stringify(data));
        a._id = l_appSeqNo;
        resolve(data);
      })
    })
  }

  executeAfterUpdate(url, fieldsData) {
    for (let data of fieldsData) {
      if (url.indexOf(data.column_name) !== -1) {
        var substring = "'" + data.column_name + "'";
        if (data.column_name == 'status_flag') {
          if (data.valueToSend == 'A') {
            url = url.replace(substring, 'Active')
          } else {
            url = url.replace(substring, 'Inactive')
          }
        } else {
          url = url.replace(substring, data.valueToSend)
        }
      }
    }
    this.http.get(url).subscribe(data => {
    }, err => { })
  }
}
