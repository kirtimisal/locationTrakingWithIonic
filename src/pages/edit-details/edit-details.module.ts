import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditDetailsPage } from './edit-details';

@NgModule({
  declarations: [
    EditDetailsPage
  ],
  imports: [
    IonicPageModule.forChild(EditDetailsPage),
  ]
})
export class EditDetailsPageModule {}