import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SummaryReportPage } from './summary-report';
import { SearchFilterPageModule } from './../../pipes/search-filter/search-filter.module';

@NgModule({
  declarations: [
    SummaryReportPage
  ],
  imports: [
    IonicPageModule.forChild(SummaryReportPage),SearchFilterPageModule
  ]
})
export class SummaryReportPageModule {}