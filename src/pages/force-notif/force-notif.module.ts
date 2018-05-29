import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ForceNotif } from './force-notif';

@NgModule({
  declarations: [
    ForceNotif
    
  ],
  imports: [
    IonicPageModule.forChild(ForceNotif)
  ]
})
export class ForceNotifModule {}