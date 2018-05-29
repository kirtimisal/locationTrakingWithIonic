import { Component } from '@angular/core';
import {   NavParams,  ModalController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  notificationList: any = {};
  isUnread: any = "no";
  url: any;
  userDetails: any;
  user_code: any;
  password: any;
  archievedEntriesModal: any;
  constructor(public modalCtrl: ModalController, public navParams: NavParams,
    public pouchDBService: PouchDBService, public globalObjectServices: GlobalObjectsProvider) {
    this.url = this.globalObjectServices.getScopeUrl();
    this.userDetails = this.globalObjectServices.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.password = this.userDetails.password;
    this.globalObjectServices.callLocalNotification(this.url, this.user_code);
  }

  ionViewDidLoad() {
    this.pouchDBService.getObject("localNotif").then((resdata) => {
      var data: any = resdata
      this.notificationList.notifDetails = data.notifList
    }, (data) => { })
  }

  openArchivedNotif() {
    this.archievedEntriesModal = this.modalCtrl.create('ArchivedPage', { archivedList: this.notificationList.notifDetails });
    this.archievedEntriesModal.present();
    this.archievedEntriesModal.onDidDismiss(() => {
      this.ionViewDidLoad();
    });
  }

  markAsRead(item, index) {
    for (let obj of this.notificationList.notifDetails) {
      if (obj.seq_id == item.seq_id) {
        obj.isRead = "yes"
      }
      if (obj.isRead == "no") {
        this.isUnread = "yes"
      }
    }
    var temp: any = {};
    this.pouchDBService.getObject("localNotif").then((dd) => {
      temp = dd;
      temp.notifList = this.notificationList.notifDetails;
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    }, (err) => {
      temp.notifList = this.notificationList.notifDetails;
      temp._id = "localNotif";
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    })
    this.globalObjectServices.displayCordovaToast("Notification Marked As Read");
  }


  markAsUnread(item, index) {
    for (let obj of this.notificationList.notifDetails) {
      if (obj.seq_id == item.seq_id) {
        obj.isRead = "no";
        this.isUnread = "yes";
      }
    }
    var temp: any = {};
    this.pouchDBService.getObject("localNotif").then((dd) => {
      temp = dd;
      temp.notifList = this.notificationList.notifDetails;
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    }, (err) => {
      temp.notifList = this.notificationList.notifDetails;
      temp._id = "localNotif";
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    })
    this.globalObjectServices.displayCordovaToast("Notification Marked As Unread");
  }

  open(item, index) {
    var actionParam = item.actionParam;
    actionParam = actionParam.replace("'USER_CODE'", this.user_code);
    actionParam = actionParam.replace("'VRNO'", item.vrno);
    actionParam = actionParam.replace("'TCODE'", item.tcode);
    actionParam = actionParam.replace("'TNATURE'", item.tnature);
    actionParam = actionParam.replace("'EMP_CODE'", item.emp_CODE);
    actionParam = actionParam.replace("'APPR_TYPE'", item.appr_TYPE);
    actionParam = actionParam.replace("'TNATURE_NAME'", item.tnature_NAME);
    actionParam = actionParam.replace("'PASSWORD'", this.password);
    this.globalObjectServices.openWebpage(actionParam);
  }

  archieveEntry(item, index) {
    var l_data = [];
    var temp: any = {};
    var id = "archieve_Data";
    l_data.push(item)
    this.deleteEntry(item, index);
    this.pouchDBService.getObject(id).then((data) => {
      temp = data;
      if (l_data) {
        var list = l_data.concat(temp.arhieveList);
      }
      temp.arhieveList = list;
      this.pouchDBService.updateJSON(temp);
    }, (err) => {
      if (l_data) {
        temp.arhieveList = l_data;
      }
      temp._id = id;
      this.pouchDBService.updateJSON(temp);
    })
    this.globalObjectServices.displayCordovaToast("Notification Moved to Archive");
  }


  deleteEntry(item, index) {
    this.notificationList.notifDetails.splice(index, 1);
    for (let obj of this.notificationList.notifDetails) {
      if (obj.isRead == "no") {
        this.isUnread = "yes"
      }
    }
    var temp: any = {};
    this.pouchDBService.getObject("localNotif").then((dd) => {
      temp = dd;
      temp.notifList = this.notificationList.notifDetails;
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    }, err => {
      temp.notifList = this.notificationList.notifDetails;
      temp._id = "localNotif";
      temp.isUnread = this.isUnread;
      this.pouchDBService.updateJSON(temp);
    })
  }

}
