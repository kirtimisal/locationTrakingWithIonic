import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartyListPage } from './party-list';
// import { FilterPage } from './party-list';

@NgModule({
  declarations: [
    PartyListPage
  ],
  imports: [
    IonicPageModule.forChild(PartyListPage),
  ]
})
export class PartyListPageModule { }
