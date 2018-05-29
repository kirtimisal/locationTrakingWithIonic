import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchEntryPage } from './search-entry';

@NgModule({
  declarations: [
    SearchEntryPage
  ],
  imports: [
    IonicPageModule.forChild(SearchEntryPage),
  ]
})
export class SearchEntryPageModule {}