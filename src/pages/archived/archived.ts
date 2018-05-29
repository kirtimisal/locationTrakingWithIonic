import { Component } from '@angular/core';
import {   NavParams, ViewController,  IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { PouchDBService } from '../../providers/pouchDB/pouchServies';

@IonicPage()
@Component({
    selector: 'page-notification',
    templateUrl: 'Archived.html'
  })
  
  export class ArchivedPage {
    archivedList: any;
    selectDiv: any;
    chckedIndexs: any;
    filter: any = {};
    isUnread: any;
    constructor( params: NavParams, public pouchDBService: PouchDBService,
      private viewCtrl: ViewController, private globalObjects: GlobalObjectsProvider) {
      this.isUnread = params.get("isUnread");
    }
  
    ionViewDidLoad() {
      this.selectDiv = 0;
      this.pouchDBService.getObject("archieve_Data").then((resdata) => {
        var data: any = resdata;
        this.archivedList = data.arhieveList;
        for (let obj of this.archivedList) {
          if (obj.toggled) { obj.toggled = false; }
        }
        if (this.chckedIndexs) {
          this.chckedIndexs = []
        }
      }, (data) => { })
    }
  
    recoverdSelectedItems() {
      var selectedList = [];
      for (let obj of this.archivedList) {
        if (obj.toggled) {
          selectedList.push(obj);
        }
      }
      var tempList = this.archivedList;
      for (let obj of selectedList) {
        var id = tempList.indexOf(obj)
        tempList.splice(id, 1);
      }
      var temp: any = {};
      this.pouchDBService.getObject("archieve_Data").then((resdata) => {
        temp = resdata;
        temp.arhieveList = tempList;
        this.archivedList = temp.arhieveList
        temp.isUnread = this.isUnread;
        this.pouchDBService.updateJSON(temp);
      }, err => {
        temp.arhieveList = tempList;
        temp._id = "archieve_Data";
        temp.isUnread = this.isUnread;
        this.pouchDBService.updateJSON(temp);
      })
  
      var temp1: any = {};
      this.pouchDBService.getObject("localNotif").then(dd => {
        temp1 = dd;
        for (let obj of selectedList) {
          temp1.notifList.push(obj);
        }
        temp1.isUnread = this.isUnread;
        this.pouchDBService.updateJSON(temp1);
      }, err => {
        for (let obj of selectedList) {
          temp1.notifList.push(obj);
        }
        temp1._id = "localNotif";
        temp1.isUnread = this.isUnread;
        this.pouchDBService.updateJSON(temp1);
      })
      this.archivedList = tempList;
    }
  
  
    delete(item, index) {
      var temp: any = {};
      this.pouchDBService.getObject("archieve_Data").then(dd => {
        temp = dd;
        for (let obj of temp.arhieveList) {
          if (item.seq_id == obj.seq_id) {
            var i = temp.arhieveList.indexOf(obj)
            temp.arhieveList.splice(i, 1);
          }
        }
        this.archivedList = temp.arhieveList;
        this.pouchDBService.updateJSON(temp);
      }, err => {
      })
  
    }
  
    deleteSelectedItems() {
      let alertVal = this.globalObjects.confirmationPopup('Do you want to Delete all selected Notification?');
      alertVal.present();
      alertVal.onDidDismiss((data) => {
        if (data == true) {
          var selectedList = [];
          for (let obj of this.archivedList) {
            if (obj.toggled) {
              selectedList.push(obj);
            }
          }
          var tempList = this.archivedList;
          for (let obj of selectedList) {
            var id = tempList.indexOf(obj)
            tempList.splice(id, 1);
          }
          var temp: any = {};
          this.pouchDBService.getObject("archieve_Data").then((data) => {
            temp = data;
            temp.arhieveList = tempList;
            this.archivedList = temp.arhieveList
            temp.isUnread = this.isUnread;
            this.pouchDBService.updateJSON(temp);
          },  (err)=> {
            temp.arhieveList = tempList;
            temp._id = "archieve_Data";
            temp.isUnread = this.isUnread;
            this.pouchDBService.updateJSON(temp);
          })
          this.archivedList = tempList;
        }
      });
    }
    selectDivValue (item) {
      this.selectDiv = 1;
    }
  
    back() {
      this.viewCtrl.dismiss();
    }
    openLink(link) {
      this.globalObjects.openWebpage(link);
    }
  }
  