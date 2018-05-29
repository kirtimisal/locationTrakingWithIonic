import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ApprovalStatusPage } from './approval-status';

@NgModule({
  declarations: [
    ApprovalStatusPage,
  ],
  imports: [
    IonicPageModule.forChild(ApprovalStatusPage),
  ],
})
export class ApprovalStatusPageModule {}
