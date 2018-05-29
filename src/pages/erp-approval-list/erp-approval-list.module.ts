import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErpApprovalListPage } from './erp-approval-list';
import { SearchFilterPageModule } from '../../pipes/search-filter/search-filter.module';

@NgModule({
  declarations: [
    ErpApprovalListPage
  ],
  imports: [
    IonicPageModule.forChild(ErpApprovalListPage),
    SearchFilterPageModule
  ]
})
export class ErpApprovalListPageModule { }