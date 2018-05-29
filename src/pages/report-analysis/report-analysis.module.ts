import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportAnalysisPage } from './report-analysis';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    ReportAnalysisPage
  ],
  imports: [
    IonicPageModule.forChild(ReportAnalysisPage),
    ChartsModule
  ]
})
export class ReportAnalysisPageModule {}