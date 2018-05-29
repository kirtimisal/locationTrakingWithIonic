import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CheckMailPage } from './check-mail';

@NgModule({
  declarations: [
    CheckMailPage
  ],
  imports: [
    IonicPageModule.forChild(CheckMailPage),
  ]
})
export class CheckMailPageModule {}