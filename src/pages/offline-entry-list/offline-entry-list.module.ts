import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineEntryListPage } from './offline-entry-list';

@NgModule({
  declarations: [
    OfflineEntryListPage
  ],
  imports: [
    IonicPageModule.forChild(OfflineEntryListPage),
  ]
})
export class OfflineEntryListPageModule {}