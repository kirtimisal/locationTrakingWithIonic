import { Component,  ChangeDetectorRef } from '@angular/core';
import {  NavController,  NavParams,   ViewController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { Http } from '@angular/http';

@IonicPage()
@Component({
    selector:'edit-details-page',
    templateUrl: 'edit-details.html'
  })
  export class EditDetailsPage {
    subItem: any = {}
    seqId: any;
    constructor(public navCtrl: NavController, private params: NavParams, private changeDetector: ChangeDetectorRef,
      public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public http: Http) {
      this.seqId = this.params.get("seqId");
      this.subItem = this.params.get("subItem");
  
      if (this.subItem.editedItem) {
        this.subItem.editedItem = this.subItem.editedItem;
      } else {
        this.subItem.editedItem = {};
      }
      this.subItem.editedItem.indentQty = this.subItem.value;
      this.subItem.editedItem.heading = this.subItem.heading;
    }
    ngAfterViewChecked() {
      this.changeDetector.detectChanges();
    }
  
    chackApprQty(): void {
      if (parseInt(this.subItem.editedItem.indentQty) < parseInt(this.subItem.editedItem.updatedQty)) {
        let alertVal = this.globalObjects.showAlert("Approved Qty should be less than or equal to Indent Qty");
        alertVal.present();
        this.subItem.editedItem.updatedQty = 0;
        this.changeDetector.detectChanges();
      }
    }
    checkRejectConfirmation(val) {
      if (val) {
        this.subItem.editedItem.updatedQty = 0;
      } else {
        this.subItem.editedItem.updatedQty = parseInt(this.subItem.editedItem.indentQty);
      }
    }
  
    save(editedItem) {
      if (!editedItem.rejectConfirmation) {
        if (!editedItem.updatedQty || editedItem.updatedQty == 0) {
          editedItem.updatedQty = parseInt(editedItem.indentQty);
        }
      }
      this.viewCtrl.dismiss(editedItem);
    }
    closeModal() {
      if (!this.subItem.editedItem.rejectConfirmation) {
        if (this.subItem.editedItem.updatedQty || this.subItem.editedItem.updatedQty == 0) {
          this.subItem.editedItem.updatedQty = parseInt(this.subItem.editedItem.indentQty);
        }
      }
      this.viewCtrl.dismiss(this.subItem.editedItem);
    }
  }