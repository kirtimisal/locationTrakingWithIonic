import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddUpdateOrderPage } from './add-update-order';

@NgModule({
  declarations: [
    AddUpdateOrderPage
  ],
  imports: [
    IonicPageModule.forChild(AddUpdateOrderPage),
  ]
})
export class AddUpdateOrderPageModule {}