import { Component } from '@angular/core';
import {  NavController, NavParams, IonicPage } from 'ionic-angular';
import { GlobalObjectsProvider } from '../../providers/global-objects/global-objects';
import { EntryListPage } from '../entry-list/entry-list';
import { Http } from '@angular/http';
// import * as moment from 'moment';
import { AddUpdateEntryPage } from '../add-update-entry/add-update-entry';


/**
 * Generated class for the CalenderDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calender-dashboard',
  templateUrl: 'calender-dashboard.html',
})
export class CalenderDashboardPage {
  date: any = new Date();
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  // monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;

  l_obj: any;
  l_obje: any = [];
  sp_obj;
  isSelected: any;
  selectedEvent: any = [];
 
  // l_obje.seqNo = AuthServices.appSeqNo();
  default_populate_data;
  updation_process;

  // eventDate: Date = new Date();
  // eventText: String = '';
  // events: any = [{
  //     d: new Date(),
  //     text: 'First Event'
  // }];

  eventSource = [];
  viewTitle: string;
  selectedDay = new Date();
 


  reportingDate = [];

  calendar = {
    mode: 'month',
    currentDate: this.selectedDay,

  };


  constructor(public navCtrl: NavController, public globalObjects: GlobalObjectsProvider, private http: Http, public navParams: NavParams) {

  }
  l_userCode = this.globalObjects.getLocallData('userDetails').user_code;

  ionViewDidLoad() {
    console.log('ionViewDidLoad CalenderDashboardPage');
    this.l_obj = this.navParams.get('obj');
    // console.log(this.l_obj.table_desc);
    this.sp_obj = this.l_obj;
    this.default_populate_data = this.sp_obj.default_populate_data;
    this.updation_process = this.sp_obj.updation_process;
    this.l_obje.seqNo = this.sp_obj.seqNo;
    // console.log(this.l_obj.seqNo);
    let url = this.globalObjects.getScopeUrl() + "reportingDateListByType?userCode=" + this.l_userCode + '&seqNo=' + this.l_obj.seqNo;
    // console.log(url);
    this.http.get(url).map(res => res.json()).subscribe(data => {
      // this.events = data;
       console.log(data);




       this.reportingDate  = data['reportingDate'];
      
       for(let eve of this.reportingDate){
         let e = new Event();
         e.allDay= false;
         e.startTime = new Date(eve.startTime);
         e.endTime = new Date(eve.endTime);
         e.title = 'Event';
         this.eventSource.push(e);

       }
      //  let d = new Date(this.eventSource[0].startTime);
      //  console.log(d);

       console.log('eventSource-------------------------',this.eventSource);






      // this.eventSource = this.events;
      // console.log(this.events, this.eventSource);

      // let eventData = data;

      // eventData.startTime = new Date(data.date);
      // eventData.endTime = new Date(data.date);

      // let events = this.eventSource;
      // events.push(eventData);
      // this.eventSource = [];
      // setTimeout(() => {
      //   this.eventSource = events;
      // });

    //   this.events.push({
    //     d: this.eventDate,
    //     text: this.eventText || 'New Event'
    // });
    // console.log('Currents Logs--------------------------------------',this.events);
    // this.eventText = '';
    
    



      //console.log(" $scope.events : " + JSON.stringify($scope.events));
    })
  }


  onViewTitleChanged(title) {
    this.viewTitle = title;
  }

  // onEventSelected(event) {
  //   console.log('On Click');
  //   let start = moment(event.startTime).format('LLLL');
  //   let end = moment(event.endTime).format('LLLL');

  //   let alert = this.alertCtrl.create({
  //     title: '' + event.title,
  //     subTitle: 'From: ' + start + '<br>To: ' + end,
  //     buttons: ['OK']
  //   })
  //   alert.present();
  // }

  onTimeSelected(ev) {
    console.log("-------onTimeSelected---------",ev);
    console.log(ev);
    this.selectedDay = ev.selectedTime;
    var dates = this.selectedDay;
    console.log('dates-------------------------------------',dates);
    var Inputdate = JSON.stringify(this.globalObjects.formatDate(dates, 'yyyy-MM-dd'));
    this.l_obje.date2 = Inputdate.split('"').join('');
    this.l_obje.updation_process = this.updation_process;
    this.l_obje.table_desc = this.sp_obj.table_desc;
    // console.log(this.l_obje);
    // $state.go('entryList', { obj: l_obje });
    this.navCtrl.push(EntryListPage, { sp_obj: this.l_obje })
  }


  // buttonClick(ev) {
  //   // alert("buttonClick");


  //   console.log("-------onTimeSelected---------",ev);
   
  //   var dates = this.selectedDay;
  //   console.log('dates-------------------------------------',dates);
  //   var Inputdate = JSON.stringify(this.globalObjects.formatDate(dates, 'yyyy-MM-dd'));
  //   this.l_obje.date2 = Inputdate.split('"').join('');
  //   this.l_obje.updation_process = this.updation_process;
  //   this.l_obje.table_desc = this.sp_obj.table_desc;
   
  //   this.navCtrl.push(EntryListPage, { obj: this.l_obje })


  // }

  // addEvent() {
  //   let modal = this.modalCtrl.create(AddUpdateEntryPage, { selectedDay: this.selectedDay });
  //   modal.present();
  //   modal.onDidDismiss(data => {
  //     if (data) {
  //       let eventData = data;

  //       eventData.startTime = new Date(data.startTime);
  //       eventData.endTime = new Date(data.endTime);

  //       let events = this.eventSource;
  //       events.push(eventData);
  //       this.eventSource = [];
  //       setTimeout(() => {
  //         this.eventSource = events;
  //       });
  //     }
  //   });
  // }

  addEvent() {
    console.log('Entry Page.......');
    this.l_obje.type = "addEntry";
    this.l_obje.table_desc = this.sp_obj.table_desc;
    this.l_obje.updation_process = this.sp_obj.updation_process;
    this.l_obje.table_desc = this.sp_obj.table_desc;
    this.l_obje.seqNo = this.sp_obj.seqNo;
    console.log(this.l_obje.seqNo);
    var dates = new Date();
    var Inputdate = JSON.stringify(this.globalObjects.formatDate(dates, 'dd-MM-yyyy'));
    this.l_obje.date2 = Inputdate.split('"').join('');
    console.log(this.l_obje.date2);


    if (this.default_populate_data == null || this.default_populate_data == '') {
      if (this.updation_process.charAt(0) == 'V') {
        // $state.go('entryList', { obj: l_obje });
        this.navCtrl.push(EntryListPage, { sp_obj: this.l_obje });
      } else {
        // $state.go('addUpdateEntry', { obj: l_obje });
        this.navCtrl.push(AddUpdateEntryPage, { sp_obj: this.l_obje })
      }
      // globalObjectServices.nativeTranstion("left");
    } else {
      if (this.updation_process.charAt(0) == 'V') {
        // $state.go('entryList', { obj: l_obje });
        this.navCtrl.push(EntryListPage, { sp_obj: this.l_obje })
      } else {
        // $state.go('addPopulatedEntry', { obj: l_obje });
        this.navCtrl.push(AddUpdateEntryPage, { sp_obj: this.l_obje })


      }
      // globalObjectServices.nativeTranstion("left");
    }
  }
}
export class Event{
   allDay:boolean;
   startTime:Date;
   endTime: Date;
   title:string;
}