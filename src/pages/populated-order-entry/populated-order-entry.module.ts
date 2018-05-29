import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopulatedOrderEntryFormPage } from './populated-order-entry';

@NgModule({
    declarations: [
        PopulatedOrderEntryFormPage
    ],
    imports: [
        IonicPageModule.forChild(PopulatedOrderEntryFormPage),
    ]
})
export class PopulatedOrderEntryFormPageModule { }