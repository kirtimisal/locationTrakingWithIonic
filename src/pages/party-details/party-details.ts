import { Component, ViewChild, ElementRef } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the PartyDetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-party-details',
  templateUrl: 'party-details.html',
})
export class PartyDetailsPage {
  @ViewChild('scroll') scroll: any;
  $: any;
  sp_obj: any = {};
  l_appSeqNo: string;
  user_code: string
  url: string;
  maxlength: any = 0;
  activebutton: any = 1;
  userDetails: any = {};
  prevId: any = 0;
  partyDetails: any = [];
  Details: any = {};
  subHeaderWidth:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private emailComposer: EmailComposer, public httpClient: HttpClient, private globalObjects: GlobalObjectsProvider) {
    this.sp_obj = navParams.get('sp_obj');
    this.userDetails = this.globalObjects.getLocallData("userDetails");
    this.user_code = this.userDetails.user_code;
    this.url = this.globalObjects.getScopeUrl();
    this.l_appSeqNo = this.sp_obj.seqNo;
    // var element = document.stylesheets;
    // console.log(element.offsetHeight);
  }

  @ViewChild('subHeader') subHeader: ElementRef;

 async ionViewDidLoad() {
   
    this.globalObjects.showLoading();
    var l_url = this.url + "getDetailsOfParty?seqNo=" + this.sp_obj.seqNo +
      "&userCode=" + this.user_code + "&accCode=" + this.sp_obj.partyCode + "&entityCode=" + this.userDetails.entity_code;
    await this.httpClient.get(l_url)
      .subscribe(resData => {
        var data: any = resData;
        this.globalObjects.hideLoading();
        this.partyDetails = data.approvalDetails;
        for (let items of this.partyDetails) {
          this.maxlength++;
          if (items.heading == 'Details') {
            for (let item of items.values) {
              for (let subItem of item) {
                if (subItem.heading == 'Mobile' || subItem.heading == 'mobile' || subItem.heading == 'Phone') {
                  this.Details["mobile"] = subItem.value;
                } else if (subItem.heading == 'E-Mail' || subItem.heading == 'Email' || subItem.heading == 'email') {
                  this.Details["email"] = subItem.value;
                } else if (subItem.heading == 'Party Code') {
                  this.Details["partyCode"] = subItem.value;
                } else if (subItem.heading == 'City' || subItem.heading == 'city') {
                  this.Details["city"] = subItem.value;
                } else if (subItem.heading == 'Party Name') {
                  // if(subItem.value.length >10){
                  //   this.Details["margin"] = subItem.value.length;
                  // }else{
                  //   this.Details["margin"] = subItem.value.length;
                  // }
                  
                  this.Details["partyName"] = subItem.value;
                }
              }
            }
          }
        }

        this.autoScroll();
      }, err => {
        this.globalObjects.hideLoading();
      })
      this.subHeaderWidth=this.subHeader.nativeElement.offsetWidth-60+"px";
  }

  public backToStart(): void {
    this.scroll._scrollContent.nativeElement.scrollLeft = 0;
  }

  public scrollToRight(): void {
    var scroll = this.scroll._scrollContent.nativeElement.scrollLeft + 500;
    this.scroll._scrollContent.nativeElement.scrollLeft = scroll;
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
  openEmailComposer(emailId) {
    if (emailId) {
      this.emailComposer.requestPermission().then((available: boolean) => {
        let email = {
          to: emailId,
          isHtml: true
        };
        this.emailComposer.open(email);
      });
    }
  }
}
