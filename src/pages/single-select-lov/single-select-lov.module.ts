import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SingleSelectLovPage } from './single-select-lov';
import { SearchFilterPageModule } from './../../pipes/search-filter/search-filter.module';
@NgModule({
  declarations: [
    SingleSelectLovPage
  ],
  imports: [
    IonicPageModule.forChild(SingleSelectLovPage),
    SearchFilterPageModule
  ]
})
export class SingleSelectLovPageModule { }