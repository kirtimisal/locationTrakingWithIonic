import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUpdateEntryPage } from './add-update-entry';
import { DirectivesModule } from './../../directives/directives.module';
// import { SignaturePadPageModule } from '../signature-pad/signature-pad.module';



@NgModule({
  declarations: [
    AddUpdateEntryPage,
  ],
  imports: [
    IonicPageModule.forChild(AddUpdateEntryPage),
    DirectivesModule
  ]
})
export class AddUpdateEntryPageModule { }