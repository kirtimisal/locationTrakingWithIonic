import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationPopulatedEntryPage } from './location-populated-entry';

@NgModule({
  declarations: [
    LocationPopulatedEntryPage
  ],
  imports: [
    IonicPageModule.forChild(LocationPopulatedEntryPage),
  ]
})
export class LocationPopulatedEntryPageModule {}