import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SignaturePadPage } from './signature-pad';
import { SignaturePadModule } from 'angular2-signaturepad';

@NgModule({
  declarations: [
    SignaturePadPage
  ],
  imports: [
    IonicPageModule.forChild(SignaturePadPage),
    SignaturePadModule
  ]
})
export class SignaturePadPageModule {}