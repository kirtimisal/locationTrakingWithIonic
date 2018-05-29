import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PartyDetailsPage } from './party-details';

@NgModule({
  declarations: [
    PartyDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(PartyDetailsPage),
  ]
})
export class PartyDetailsPageModule {}