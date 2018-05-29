import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageEntryPage } from './image-entry';
import { IonicImageViewerModule } from 'ionic-img-viewer';

@NgModule({
    declarations: [
        ImageEntryPage
    ],
    imports: [
        IonicPageModule.forChild(ImageEntryPage),
        IonicImageViewerModule
    ]
})
export class ChangePasswordPageModule { }