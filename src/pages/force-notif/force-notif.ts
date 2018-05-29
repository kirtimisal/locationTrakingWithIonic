import { Component } from '@angular/core';
import {   NavParams, ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';

@IonicPage()
@Component({
    selector: 'page-forceNotif',
    templateUrl: 'forceNotif.html'
  })
  export class ForceNotif {
    forceNotifList: any;
    constructor(params: NavParams, private viewCtrl: ViewController, private globalObjects: GlobalObjectsProvider) {
      this.forceNotifList = params.get("forceNotifList");
  
    }
    saveFlag() {
      this.viewCtrl.dismiss();
      this.globalObjects.setDataLocally("forceFlag", false);
    }
    openLink(link) {
      this.globalObjects.openWebpage(link);
    }
  }