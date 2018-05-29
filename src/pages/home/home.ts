import { Component } from '@angular/core';
import { NavController, ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';
import { DatePipe } from '@angular/common';
import { Events } from 'ionic-angular';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  online: any;
  unique_message: any;
  welcomeMsg: any;
  offline_flag_app_run: boolean;
  flagForShortReportTab: number;
  showSummaryTabFlag: any;
  platform: any;
  url: any;
  entity_code: any;
  l_userName: any;
  l_userCode: any;
  l_aapType: any;
  flagForOneTab: any;
  forceNotifList: any;
  dashboradData: any;
  forceNotifModal: any;
  firstScreen: any; showSummaryValueFlag: any;
  constructor(public navCtrl: NavController, public events: Events, private http: Http, public modalCtrl: ModalController,
    public globalObjects: GlobalObjectsProvider, public pouchDBService: PouchDBService) {
    this.url = this.globalObjects.getScopeUrl();
    this.online = this.globalObjects.getOnlineStatus();
  }

  ionViewDidLoad() {
    if (this.globalObjects.getLocallData("userDetails")) {
      this.l_userName = this.globalObjects.getLocallData("userDetails").userName;
      this.l_userCode = this.globalObjects.getLocallData("userDetails").user_code;
      this.l_aapType = this.globalObjects.getLocallData("apptype");
      this.entity_code = this.globalObjects.getLocallData("userDetails").entity_code;
      if(!this.entity_code){
        this.entity_code="All";
      }
      if ('V' == this.globalObjects.getLocallData("entity_code")) {
        // window.screen.lockOrientation('portrait');
      } else {
        if ("H" == this.globalObjects.getLocallData("screenOrientation")) {
          // window.screen.lockOrientation('landscape');
        }
      }

      if (this.online) {
        this.globalObjects.showLoading();
        this.http.get(this.url + "dyanamicWelcomeMsg?tabId=" + this.l_aapType + "&userName=" + this.l_userName)
          .map(res => res.json()).subscribe(data => {
            this.welcomeMsg = data.welcomeMsg;
          }, err => { });

        this.http.get(this.url + "getTableDetail?appType=" + this.l_aapType + '&userCode=' + this.l_userCode)
          .map(res => res.json()).subscribe(data => {
            this.dashboradData = "";
            this.globalObjects.hideLoading();
            if (data.table_Detail !== null) {
              var l_tableData = data.table_Detail[0];
              if (data.table_Detail.length == 1 && l_tableData.firstScreen != 'E' && l_tableData.firstScreen != 'SE' &&
                l_tableData.firstScreen != 'I' && l_tableData.firstScreen != 'M' && l_tableData.firstScreen != 'H' &&
                l_tableData.firstScreen != 'EG' && l_tableData.firstScreen != 'N' && l_tableData.firstScreen != 'EA') {
                this.flagForOneTab = 1;
                this.firstScreen = l_tableData.firstScreen;
                if (l_tableData.firstScreen == "G" || l_tableData.firstScreen == "T" ||
                  l_tableData.firstScreen == 1) {
                  this.globalObjects.setDataLocally("portlet_Id", l_tableData.portlet_Id)
                  if (l_tableData.firstScreen == 1 || l_tableData.firstScreen == "T") {
                    if (l_tableData.firstScreen == "T") {
                      this.showSummaryValueFlag = 1;
                    }
                    this.showSummaryTabFlag = 1;
                  }
                } else if (l_tableData.firstScreen == "S") {
                  this.flagForShortReportTab = 1;
                }
              } else {
                this.offline_flag_app_run = false;
                this.globalObjects.setOfflineFlag(false);
                this.dashboradData = data.table_Detail;
                for (let obj of this.dashboradData) {
                  let id = "entrySeqNo" + obj.seqNo;
                  this.pouchDBService.getObject(id).then(dta => {
                    let data: any = dta;
                    obj.noOfEntry = data.count;
                  }, err => {
                    obj.noOfEntry = 0;
                  });
                  if (obj.offline_flag_app_run == "T") {
                    this.offline_flag_app_run = true;
                    this.globalObjects.setOfflineFlag(true);
                  }
                }
              }
            } else {
              this.dashboradData = "";
              this.offline_flag_app_run = false;
              this.globalObjects.setOfflineFlag(false);
            }
            this.events.publish('user:created', "komal", Date.now());
          },
          err => {
            this.globalObjects.hideLoading();
            this.dashboradData = "";
            this.offline_flag_app_run = false;
            this.globalObjects.setOfflineFlag(false);
          });
        this.http.get(this.url + 'dyanamicWelcomeMsg?tabId=' + this.l_aapType + '&userName=' + this.l_userName).map(res => res.json()).subscribe(data => {
          this.welcomeMsg = data.welcomeMsg;
          this.pouchDBService.getObject("welcomeMsg").then(data1 => {
            var temp: any = data1;
            temp.welcomeMsg = data.welcomeMsg;
            this.pouchDBService.put("welcomeMsg", temp);
          }, err => {
            var temp: any = {};
            temp.welcomeMsg = data.welcomeMsg;
            temp._id = "welcomeMsg";
            this.pouchDBService.put("welcomeMsg", temp);
          })
        }, err => {
          console.log(err);
        })
        if (this.globalObjects.getLocallData("forceFlag") == true) {
          this.http.get(this.url + 'forceNotification?userCode=' + this.l_userCode + "&seqNo=55").map(res => res.json()).subscribe(data => {
            let forceNotifList = data.model;
            if (forceNotifList.length !== 0) {
              this.forceNotifModal = this.modalCtrl.create('ForceNotif', { forceNotifList: forceNotifList });
              this.forceNotifModal.present();
            }
          })
        }
        this.globalObjects.callLocalNotification(this.l_aapType, this.l_userCode);
      } else {
        this.pouchDBService.getObject(this.l_aapType + "_seqNo").then(resData => {
          var data: any = resData;
          this.dashboradData = JSON.parse(JSON.stringify(data.table_Detail));
          for (let obj of this.dashboradData) {
            let id = "entrySeqNo" + obj.seqNo;
            this.pouchDBService.getObject(id).then(data21 => {
              var data: any = data21;
              obj.noOfEntry = data.count;
            }, err => {
              obj.noOfEntry = 0;
            });
          }
        }, err => {
          let alertVal = this.globalObjects.showAlert("Data is not available please REFRESH app");
          alertVal.present();
        })
        this.pouchDBService.getObject("welcomeMsg").then(data22 => {
          var data1: any = data22;
          this.welcomeMsg = data1.welcomeMsg;
        }, err => { })
      }
    } else {
      if (!this.globalObjects.getLocallData("isAppLaunch")) {
        this.navCtrl.setRoot('AppkeyValidationPage');
      } else {
        this.navCtrl.setRoot('LoginPage');
      }
    }
  }

  openWebpage(link) {
    this.globalObjects.openWebpage(link);
  }
  openWebLink(link) {
    link = link.replace("'strLoginID'", this.l_userCode);
    link = link.replace("'strPassword'", this.globalObjects.getLocallData("userDetails").password);
    this.globalObjects.openWebpage(link);
  }
  openNotification() {
    this.navCtrl.push('NotificationPage');
  }

  pageDetails(item) {
    var lParam: any = [];
    lParam = {
      table: item.value,
      seqNo: item.seqNo,
      portlet_Id: item.portlet_Id,
      table_desc: item.table_desc,
      firstScreen: item.firstScreen,
      dependent_next_entry_seq: item.dependent_next_entry_seq,
      default_populate_data: item.default_populate_data,
      updation_process: item.updation_process,
      replicate_fields: item.replicate_fields,
      replicate_rec: item.replicate_rec,
      access_contrl: item.access_contrl,
      unique_message: item.unique_message,
      duplicate_row_value_allow: item.duplicate_row_value_allow,
      update_key: item.update_key,
      display_clause: item.display_clause
    }

    this.unique_message = item.unique_message;
    this.globalObjects.setDataLocally("AppSeqNO", lParam.seqNo)
    if (item.data_UPLOAD == "T") {
      // this.platform.ready().then((readySource) => {
      //   this.diagnostic.isLocationEnabled().then(
      //     (isAvailable) => {
      //       console.log('Is available? ' + isAvailable);
      //       alert('Is available? ' + isAvailable);
      //     }).catch((e) => {
      //       console.log(e);
      //       alert(JSON.stringify(e));
      //     });
      // });
      this.setPage(lParam, item);
    } else {
      this.setPage(lParam, item);
    }
  }

  setPage(l_param, item) {
    var datePipe = new DatePipe("en-US");

    this.globalObjects.setDataLocally("tabParam", l_param);
    if (l_param.dependent_next_entry_seq != null && l_param.firstScreen != "I") {
      let l_obje: any = [];
      l_obje.seqNo = l_param.seqNo;
      let dates = new Date();
      l_obje.date2 = datePipe.transform(dates, 'dd-MM-yyyy');
      l_obje.table_desc = l_param.table_desc;
      l_obje.updation_process = l_param.updation_process;
      l_obje.dependent_next_entry_seq = l_param.dependent_next_entry_seq;
      this.navCtrl.push('EntryListPage', { sp_obj: l_obje });
    } else {
      if (l_param.firstScreen == "C") {
        this.navCtrl.push('CalenderDashboardPage', { obj: l_param });
      } else {
        if (l_param.firstScreen == "E" || l_param.firstScreen == "M") {
          if (l_param.default_populate_data == null || l_param.default_populate_data == '') {
            if (l_param.updation_process.charAt(0) == 'V') {
              let l_obje;
              l_obje.seqNo = l_param.seqNo;
              let dates = new Date();
              l_obje.date2 = datePipe.transform(dates, 'dd-MM-yyyy');
              l_obje.table_desc = l_param.table_desc;
              l_obje.updation_process = l_param.updation_process;
              this.navCtrl.push('EntryListPage', { sp_obj: l_obje });
            } else {
              this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param })
            }
          } else {
            if (l_param.updation_process.charAt(0) == 'V') {
              let l_obje;
              l_obje.seqNo = l_param.seqNo;
              let dates = new Date();
              l_obje.date2 = datePipe.transform(dates, 'dd-MM-yyyy');
              l_obje.table_desc = l_param.table_desc;
              l_obje.updation_process = l_param.updation_process;
              this.navCtrl.push('EntryListPage', { sp_obj: l_obje });
            } else {
              l_param.types = 'P';
              this.navCtrl.push('PopulatedOrderEntryFormPage', { obj: l_param })
            }
          }
        }
        if (l_param.firstScreen == "G" || l_param.firstScreen == "T" || l_param.firstScreen == 1 || l_param.firstScreen == "CV") {
          this.globalObjects.setDataLocally("portlet_Id", l_param.portlet_Id)
          this.navCtrl.push('SummaryReportPage', { obj: l_param });
        } else {
          if (l_param.firstScreen == "S") {
            this.navCtrl.push('ShortReportPage', { obj: l_param });
          } else {
            if (l_param.firstScreen == "PO") {
              l_param.type = "orderPopulated";
              l_param.access_contrl = "PO";
              l_param.mandatory_to_start_portal = item.mandatory_to_start_portal;
              this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param })
            } else {
              if (l_param.firstScreen == "O") {
                l_param.type = "order";
                l_param.types = 'O';
                l_param.mandatory_to_start_portal = item.mandatory_to_start_portal;
                this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param })
              } else {
                if (l_param.firstScreen == "I") {
                  l_param.type = 'I';
                  // this.navCtrl.push(EntryFormWithEntryListPage,{obj:"next"});
                } else {
                  if (l_param.firstScreen == "Q") {
                    l_param.type = 'Q';
                    this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param })
                  } else {
                    if (l_param.firstScreen == "SE") {
                      l_param.type = 'SE';
                      this.navCtrl.push('SearchEntryPage', { sp_obj: l_param });
                    } else {
                      if (l_param.firstScreen == "EG") {
                        l_param.type = "EG"
                        l_param.mandatory_to_start_portal = item.mandatory_to_start_portal;
                        this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param })
                      } else {
                        if (l_param.firstScreen == "L") {
                          this.navCtrl.push('LocationPopulatedEntryPage', { obj: l_param })
                        } else {
                          if (l_param.firstScreen == "LT") {
                            this.navCtrl.push('LocationTrackingPage');
                          } else {
                            if (l_param.firstScreen == "WL") {
                              this.openWebpage(this.unique_message);
                            } else if (l_param.firstScreen == 'H') {
                              this.navCtrl.push('HotSeatEntryPage', { h_obj: l_param });
                            } else if (l_param.firstScreen == 'ED') {
                              this.navCtrl.push('EntryDetailsPage');
                            } else if (l_param.firstScreen == 'EA') {
                              this.navCtrl.push('TypesOfApprovalPage', { sp_obj: l_param });
                            }
                            // Search Entry
                            else if (l_param.firstScreen == 'IM') {
                              l_param.type = "IM";
                              l_param.firstScreen = this.firstScreen;
                              this.navCtrl.push('AddUpdateEntryPage', { sp_obj: l_param });
                            } else if (l_param.firstScreen == 'PP') {
                              this.navCtrl.push('PartyListPage', { sp_obj: l_param });
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

  }

  refreshDashBoard() {
    this.ionViewDidLoad();
  }

  entryList(value, seqNo, portlet_Id, table_desc, data_UPLOAD, updation_process, screenOrientionView, default_populate_data, firstScreen) {
    var l_param1: any = [];
    l_param1.table = value;
    l_param1.seqNo = seqNo;
    l_param1.portlet_Id = portlet_Id;
    l_param1.table_desc = table_desc;

    this.globalObjects.setDataLocally("AppSeqNO", seqNo)
    this.globalObjects.setDataLocally("Data_UPLOAD", data_UPLOAD)
    this.globalObjects.setDataLocally("ScreenOrientionView", screenOrientionView)
    l_param1.default_populate_data = default_populate_data;
    l_param1.updation_process = updation_process;
    l_param1.firstScreen = firstScreen;
    this.navCtrl.push('OfflineEntryListPage', { obj: l_param1 });
  }

}


