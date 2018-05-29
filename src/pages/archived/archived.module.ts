import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArchivedPage } from './archived';

@NgModule({
    declarations: [
        ArchivedPage
    ],
    imports: [
        IonicPageModule.forChild(ArchivedPage),
    ]
})
export class ArchivedPageModule { }