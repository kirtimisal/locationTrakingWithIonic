import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShortReportDetailPage } from './short-report-detail';

@NgModule({
  declarations: [
    ShortReportDetailPage
  ],
  imports: [
    IonicPageModule.forChild(ShortReportDetailPage),
  ]
})
export class ShortReportDetailPageModule {}