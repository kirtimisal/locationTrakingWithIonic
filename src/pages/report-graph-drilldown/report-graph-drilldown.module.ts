import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ReportGraphDrilldownPage } from './report-graph-drilldown';
import { ChartsModule } from 'ng2-charts';
@NgModule({
  declarations: [
    ReportGraphDrilldownPage,
  ],
  imports: [
    IonicPageModule.forChild(ReportGraphDrilldownPage),ChartsModule
  ],
})
export class ReportGraphDrilldownPageModule {}
