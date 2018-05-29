import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HotSeatEntryPage } from './hot-seat-entry';

@NgModule({
  declarations: [
    HotSeatEntryPage
  ],
  imports: [
    IonicPageModule.forChild(HotSeatEntryPage),
  ]
})
export class HotSeatEntryPageModule {}