import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationTrackingPage } from './location-tracking';

@NgModule({
  declarations: [
    LocationTrackingPage
  ],
  imports: [
    IonicPageModule.forChild(LocationTrackingPage),
  ]
})
export class LocationTrackingPageModule {}