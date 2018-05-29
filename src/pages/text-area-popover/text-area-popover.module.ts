import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TextAreaPopoverPage } from './text-area-popover';

@NgModule({
  declarations: [
    TextAreaPopoverPage
  ],
  imports: [
    IonicPageModule.forChild(TextAreaPopoverPage),
  ]
})
export class TextAreaPopoverPageModule {}