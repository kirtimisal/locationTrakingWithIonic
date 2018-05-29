import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineRefreshTabPage } from './offline-refresh-tab';

@NgModule({
  declarations: [
    OfflineRefreshTabPage
  ],
  imports: [
    IonicPageModule.forChild(OfflineRefreshTabPage),
  ]
})
export class OfflineRefreshTabPageModule {}