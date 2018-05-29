import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { PhonegapLocalNotification } from '@ionic-native/phonegap-local-notification';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { MyApp } from './app.component';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Diagnostic } from '@ionic-native/diagnostic';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { MediaCapture } from '@ionic-native/media-capture';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { Geolocation } from '@ionic-native/geolocation';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Device } from '@ionic-native/device';
import * as $ from 'jquery';
import { Network } from '@ionic-native/network';
import { File } from '@ionic-native/file';
import { Toast } from '@ionic-native/toast';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { FileOpener } from '@ionic-native/file-opener';
import { EmailComposer } from '@ionic-native/email-composer';
// pipes
// import { SearchFilterPipe, SearchDataFilter, SearchReportFilter } from '../pipes/search-filter/search-filter';
//Providers 
import { PouchDBService } from '../providers/pouchDB/pouchServies';
import { AddUpdateEntryServicesProvider } from '../providers/add-update-entry-services/add-update-entry-services';
import { DataServicesProvider } from '../providers/data-services/data-services';
import { GlobalObjectsProvider } from '../providers/global-objects/global-objects';
import { DatePicker } from '@ionic-native/date-picker';
import { LocationEntryServicesProvider } from '../providers/location-entry-services/location-entry-services';
// Directives
// import { DirectivesModule } from '../directives/directives.module';


@NgModule({
  declarations: [
    // SearchFilterPipe, SearchDataFilter, SearchReportFilter,
    MyApp

  ],
  imports: [
    BrowserModule, HttpModule, HttpClientModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

  ],
  providers: [
    StatusBar,
    SplashScreen,
    InAppBrowser,
    GlobalObjectsProvider, Diagnostic, PhonegapLocalNotification,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    AddUpdateEntryServicesProvider, FileTransfer, FileTransferObject,
    Camera, MediaCapture, PouchDBService, Network, File, Toast, AndroidPermissions, EmailComposer,
    DataServicesProvider, BarcodeScanner, DatePicker, Geolocation, FileOpener, Device,
    LocationEntryServicesProvider
  ],

})
export class AppModule {

}
