import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfflineRefreshFormPage } from './offline-refresh-form';

@NgModule({
  declarations: [
    OfflineRefreshFormPage
  ],
  imports: [
    IonicPageModule.forChild(OfflineRefreshFormPage),
  ]
})
export class OfflineRefreshFormPageModule {}