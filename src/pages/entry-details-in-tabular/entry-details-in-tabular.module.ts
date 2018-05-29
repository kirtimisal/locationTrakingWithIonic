import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EntryDetailsInTabularPage} from './entry-details-in-tabular';


@NgModule({
  declarations: [
    EntryDetailsInTabularPage,
    
  ],
  imports: [
    IonicPageModule.forChild(EntryDetailsInTabularPage),
  ]
})
export class EntryDetailsInTabularPageModule { }