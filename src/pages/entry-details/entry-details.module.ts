import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryDetailsPage } from './entry-details';

@NgModule({
  declarations: [
    EntryDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(EntryDetailsPage),
  ]
})
export class EntryDetailsPageModule {}