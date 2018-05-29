import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { GridDetailsModalPage } from './grid-details-modal';

@NgModule({
  declarations: [
    GridDetailsModalPage
  ],
  imports: [
    IonicPageModule.forChild(GridDetailsModalPage),
  ]
})
export class GridDetailsModalPageModule {}