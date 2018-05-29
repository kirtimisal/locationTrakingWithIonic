import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeServerSettingPage} from './change-server-setting';


@NgModule({
  declarations: [
    ChangeServerSettingPage,
    
  ],
  imports: [
    IonicPageModule.forChild(ChangeServerSettingPage),
  ]
})
export class ChangeServerSettingPageModule { }
