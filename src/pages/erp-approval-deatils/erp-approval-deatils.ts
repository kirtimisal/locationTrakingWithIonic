import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { HttpClient } from '@angular/common/http';
// import { ErpApprovalItemDeatilsPage } from '../erp-approval-item-deatils/erp-approval-item-deatils'
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Events } from 'ionic-angular';
import { FileOpener } from '@ionic-native/file-opener';

@IonicPage()
@Component({
  selector: 'page-erp-approval-deatils',
  templateUrl: 'erp-approval-deatils.html',
})

export class ErpApprovalDeatilsPage {
  @ViewChild('scroll') scroll: any;

  $: any;
  tabs: any = '0';
  tabsArr: any = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  activebutton: any = 0;
  type: any;
  sp_obj: any = {};
  l_appSeqNo: string;
  table_desc: string;
  user_code: string
  url: string;
  online: boolean = true;
  userDetails: any = {};
  erpApprDetails: any = [];
  prevId: any = 0;
  maxlength: any = 0;
  itemDeatilsPage: any;
  tnature_name: any;
  slno: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events,
    public httpClient: HttpClient, private transfer: FileTransfer, private file: File, private fileOpener: FileOpener,
    private globalObjects: GlobalObjectsProvider, public modalCtrl: ModalController, public alertCtrl: AlertController) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    this.table_desc = this.sp_obj.table_desc;
    this.tnature_name = this.sp_obj.tnature_name;
    this.type = this.sp_obj.type;
  }


  ionViewDidLoad() {

    this.globalObjects.showLoading();
    var l_url = this.url + "detailsOfApprovals?tCode=" + this.sp_obj.erpItem.tCode +
      "&userCode=" + this.user_code + "&tnature=" + this.sp_obj.tnature
      + "&vrno=" + this.sp_obj.erpItem.vrno + "&accCode=" + this.sp_obj.erpItem.accCode
      + "&vrDate=" + this.sp_obj.erpItem.vrDate;

    this.httpClient.get(l_url)
      .subscribe(resData => {
        var data: any = resData;
        this.globalObjects.hideLoading();
        this.erpApprDetails = data.approvalDetails;
        var previewButtonVal: any = [];
        for (let items of this.erpApprDetails) {
          this.maxlength++;
          for (let item of items.values) {
            items.valLength = item.length;
            for (let subItem of item) {
              if (subItem.heading.indexOf("~") > -1) {
                var splitVal: any = subItem.heading.split("~");
                subItem.slno = splitVal[1];
                subItem.heading = splitVal[0];
                if (splitVal[2]) {
                  subItem.editFlag = splitVal[2];
                }
              }
              if (subItem.value.indexOf("~") > -1) {
                subItem.paraValues = subItem.value;
                subItem.value = subItem.value.split("~")[0];
              }
              if (subItem.heading == 'Annexure Type') {
                if (subItem.value == "JPG" || subItem.value == "PNG") {
                  previewButtonVal.push(["true"]);
                } else {
                  previewButtonVal.push(["false"]);
                }
              }
            }
          }
          if (items.heading.indexOf("~") > -1) {
            items.heading = items.heading.split("~")[0];
            items.showAttachmentGrid = "1";
          }
          items.previewButtonVal = [];
          items.previewButtonVal = JSON.parse(JSON.stringify(previewButtonVal));
        }
        this.autoScroll();
      }, err => {
        this.globalObjects.hideLoading();
      })
  }
  downloadFile(item) {
    this.globalObjects.showLoading();
    var rowId = "";
    var type = "";
    var Name = "";
    for (let items of item) {
      if (items.heading == 'ROWID') {
        rowId = items.value;
      }
      if (items.heading == 'Annexure Type') {
        type = items.value;
      }
      if (items.heading == 'Annexure Name') {
        Name = items.value;
      }
    }
    let directoryPath = "";
    let platformVal = this.globalObjects.getPlatformValue();
    if (platformVal) {
      if (platformVal == 'ios') {
        directoryPath = this.file.documentsDirectory;
      } else {
        directoryPath = this.file.externalRootDirectory;
      }
    } else {
      directoryPath = this.file.externalRootDirectory;
    }
    if (type == "JPG" || type == "PNG") {
      this.globalObjects.hideLoading();
      let previewModal = this.modalCtrl.create('PreviewModalPage', { obj: rowId, Name: Name });
      previewModal.present();
    } else {
      this.file.createDir(directoryPath, "DAV5_Files", false).then(result => {
        this.fileDowloadToSpecificLocation(rowId, type, directoryPath);
      }, (err) => {
        this.fileDowloadToSpecificLocation(rowId, type, directoryPath);
      });
    }
  }

  fileDowloadToSpecificLocation(rowId, type, directoryPath) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    var newDate = new Date();
    var newDateVal = this.globalObjects.formatDate(newDate, 'dd-MM-yyyy HH-mm-ss');
    newDateVal = newDateVal.replace(' ', '_');

    var pathUrl = directoryPath + "LHS_ERPAPPROVAL_DOWNLOADS/" + newDateVal + '.' + type;
    let url1 = this.url + "getDependentDoc?rowId=" + rowId;
    fileTransfer.download(url1, pathUrl).then((entry) => {
      this.globalObjects.hideLoading();
      this.globalObjects.displayCordovaToast("DownLoad Completed at location :" + entry.toURL());
      var mimeVal = 'application/' + type;
      this.fileOpener.open(pathUrl, mimeVal)
        .then(() => console.log('File is opened'))
        .catch(e => console.log('Error openening file', e));
    }, (error) => {
      this.globalObjects.hideLoading();
      this.globalObjects.displayCordovaToast(JSON.stringify(error));
    });
  }

  autoScroll() {
    var maxIndex = this.maxlength;
    var $item = $('#btn_scroll'), //Cache your DOM selector
      index = 0; //Starting index

    $('div#arrowR').click(() => {
      if (index < maxIndex) {
        index++;
        $item.animate({ 'left': '-=300px' });
      }
    });

    $('div#arrowL').click(() => {
      if (index > 0) {
        index--;
        $item.animate({ 'left': '+=300px' });
      }
    });

    var ii = "#btn_" + this.activebutton
    var width = $(ii).outerWidth();
    var id: any = this.activebutton;
    if (id === "0") {
      $("#btn_scroll").scrollLeft(0);
    } else if (id == maxIndex) {
      $("#btn_scroll").scrollLeft(0);
    } else if (id == this.prevId) {
    } else {
      if (this.prevId > id) {
        width += $("#btn_scroll").scrollLeft();
        $("#btn_scroll").scrollLeft(width);
      } else {
        width -= $("#btn_scroll").scrollLeft();
        $("#btn_scroll").scrollLeft(width);
      }
    }
    this.prevId = id;
  }

  getItemDetails(subItem, seqId, j) {
    if (subItem.editFlag) {
      let editDetailsModal = this.modalCtrl.create('EditDetailsPage', { subItem: subItem, seqId: seqId });
      editDetailsModal.onDidDismiss(editedItem => {
        for (let items of this.erpApprDetails) {
          if (items.heading == "Items") {
            var index = 0;
            for (let item of items.values) {
              if (j == index) {
                for (let sitem of item) {
                  if (sitem.heading == "Item Code") {
                    editedItem.itemCode = sitem.value;
                  }
                  if (sitem.heading == "Approved Qty") {
                    if (editedItem.rejectConfirmation) {
                      sitem.value = "Complete Qty Rejected";
                    } else {
                      sitem.value = editedItem.updatedQty + " " + editedItem.indentQty.split(" ")[1];
                    }
                    sitem.isEdited = true;
                  }

                  if (sitem.heading == "Sr. No") {
                    editedItem.itemSlno = sitem.value;
                    this.slno = subItem.slno
                  }
                  if (sitem.heading == editedItem.heading) {
                    sitem.editedItem = editedItem;
                  }
                }
              }
              index = index + 1;
            }
          }

        }
      });
      editDetailsModal.present();
    } else {
      var value = '';
      if (subItem.paraValues) {
        value = subItem.paraValues;
      } else {
        value = subItem.value;
      }

      if (subItem.slno) {
        var l_url = this.url + "paraDetailsOfApproval?tCode=" + this.sp_obj.erpItem.tCode +
          "&userCode=" + this.user_code + "&tnature=" + this.sp_obj.tnature + "&vrno=" + this.sp_obj.erpItem.vrno +
          "&value=" + encodeURIComponent(value) + "&seqId=" + seqId + "&slno=" + subItem.slno + "&entityCode="
          + this.sp_obj.erpItem.entityCode + "&vrDate=" + this.sp_obj.erpItem.vrDate;

        this.globalObjects.showLoading();
        this.httpClient.get(l_url)
          .subscribe(resData => {
            this.globalObjects.hideLoading();
            this.itemDeatilsPage = resData;
            let itemDeatilsModal = this.modalCtrl.create('ErpApprovalItemDeatilsPage', { itemDeatils: this.itemDeatilsPage });
            itemDeatilsModal.onDidDismiss(fieldsData => {
            });
            itemDeatilsModal.present();
          }, err => {
            this.globalObjects.hideLoading();
            console.log(err);
          })
      }

    }

  }


  updateStatus(approveFlag) {

    var result: any;
    var msg = "Are you sure want to "
    var buttonText;
    if (approveFlag == "A") {
      buttonText = "Approve"
    } else {
      buttonText = "Reject"
    }
    msg = msg + buttonText + " ?"

    let alertBox = this.alertCtrl.create({
      title: "Confirmation",
      message: msg,
      inputs: [
        {
          name: 'remark',
          placeholder: 'Remark',
          type: 'textarea',

        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            result = data;
            result.status = false;
            return data;
          }
        },
        {
          text: buttonText,
          handler: data => {
            result = data;
            result.status = true;
            return data;
          }
        }
      ]
    });
    alertBox.present();
    alertBox.onDidDismiss((data) => {
      if (result.status == true) {
        var editedItem = [];
        for (let items of this.erpApprDetails) {
          if (items.heading == "Items") {
            for (let item of items.values) {
              for (let sitem of item) {
                if (sitem.editedItem) {
                  delete sitem.editedItem["heading"];
                  sitem.editedItem.indentQty = sitem.editedItem.indentQty.split(" ")[0];
                  editedItem.push(sitem.editedItem);
                }
              }
            }
          }
        }
        var indentItemUpdate: any = {};
        indentItemUpdate.indentItemUpdate = editedItem;
        var l_url = this.url + "updateApprovalStatus?tCode=" + this.sp_obj.erpItem.tCode +
          "&userCode=" + this.user_code + "&tnature=" + this.sp_obj.tnature + "&vrno=" + this.sp_obj.erpItem.vrno +
          "&approveFlag=" + approveFlag + "&remark=" + encodeURIComponent(result.remark) +
          "&indentItemUpdate=" + JSON.stringify(indentItemUpdate) + "&slno=" + this.slno;

        this.globalObjects.showLoading();
        this.httpClient.get(l_url)
          .subscribe(resData => {
            this.globalObjects.hideLoading();
            var data: any = resData;
            this.globalObjects.displayCordovaToast(data.result);
            if (data.status === "success") {
              this.navCtrl.pop();
              this.events.publish('erpAppr:statusChanged', "Anjali", "");
            }
          }, err => {
            this.globalObjects.hideLoading();
            this.globalObjects.displayCordovaToast("Approval status not updated, Please try again later");
          })
      }
    });
  }

  public backToStart(): void {
    this.scroll._scrollContent.nativeElement.scrollLeft = 0;
  }

  public scrollToRight(): void {
    var scroll = this.scroll._scrollContent.nativeElement.scrollLeft + 500;
    this.scroll._scrollContent.nativeElement.scrollLeft = scroll;
  }

  selectTab(index) {
    this.activebutton = index;
    var currntEle = document.getElementById("btn_" + index);
    var rect = currntEle.getBoundingClientRect();
    var currntEleLeft = rect.left;
    var leftScroll = (this.scroll._scrollContent.nativeElement.offsetWidth - currntEle.offsetWidth) / 2;
    var scrolled_width = this.scroll._scrollContent.nativeElement.scrollLeft;

    if (index === 0) {
      this.scroll._scrollContent.nativeElement.scrollLeft = 0;
    } else if (index == (this.maxlength - 1)) {
      scrolled_width += leftScroll + 100;
      this.scroll._scrollContent.nativeElement.scrollLeft = scrolled_width;
    } else if (index == this.prevId) {
    } else {
      if (this.prevId > index) {
        scrolled_width -= leftScroll;
        if (currntEleLeft < 0) {
          currntEleLeft = -currntEleLeft;
        }
        scrolled_width = scrolled_width - currntEleLeft;
        if (scrolled_width < 0) {
          scrolled_width = -scrolled_width
        }
        this.scroll._scrollContent.nativeElement.scrollLeft = scrolled_width;
      } else {
        scrolled_width += leftScroll;
        if (currntEleLeft > leftScroll) {
          scrolled_width = currntEleLeft - scrolled_width;
          this.scroll._scrollContent.nativeElement.scrollLeft = scrolled_width;
        }
      }
    }
    this.prevId = index;
  }


  changeWillSlide($event) {
    this.tabs = $event._snapIndex.toString();
    this.activebutton = $event._snapIndex.toString();
    this.autoScroll();
  }

  scrollmain(elementId, index) {
    console.info('elementId', elementId)
    var el = document.getElementById(elementId);
    el.scrollIntoView({ behavior: "smooth" });
  }

  back() {
    this.navCtrl.pop()
  }

  getApprovalStatus() {
    this.navCtrl.push('ApprovalStatusPage', { sp_obj: this.sp_obj });
  }
}


