import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CalenderDashboardPage } from './calender-dashboard';

@NgModule({
  declarations: [
    CalenderDashboardPage
  ],
  imports: [
    IonicPageModule.forChild(CalenderDashboardPage),
  ]
})
export class CalenderDashboardPageModule {}