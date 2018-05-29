import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ServerSettingPage } from './server-setting';

@NgModule({
  declarations: [
    ServerSettingPage
  ],
  imports: [
    IonicPageModule.forChild(ServerSettingPage),
  ]
})
export class ServerSettingPageModule {}