import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';
import { GlobalObjectsProvider } from '../providers/global-objects/global-objects';
import { Injectable } from '@angular/core';
import { Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { File } from '@ionic-native/file';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
@Component({
  templateUrl: 'app.html'
})
@Injectable()
export class MyApp {
  entityCode_flag: boolean;
  e_code: any;
  entity_code: any;
  url: string;
  offline_flag_app_run: boolean;
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'HomePage';

  pages: Array<{ title: string, component: any }>;

  entityCodes: any;
  appTypes: any;
  selectAppType: any;
  appTypes_flag: any;
  pushPage: any;
  constructor(public platform: Platform, public events: Events, private file: File, private transfer: FileTransfer,
    private androidPermissions: AndroidPermissions, public statusBar: StatusBar,
    private network: Network, private http: Http, private globalObjects: GlobalObjectsProvider,
    public splashScreen: SplashScreen) {
    this.initializeApp();
    this.pushPage = 'LoginPage';
    this.network.onConnect().subscribe(data => {
      this.globalObjects.setOnlineStatus(true);
      this.nav.setRoot(this.nav.getActive().component);
    }, error => console.error(error));
    this.network.onDisconnect().subscribe(data => {
      this.globalObjects.setOnlineStatus(false);
      this.globalObjects.displayCordovaToast('You are offline...');
      this.nav.setRoot(this.nav.getActive().component);
    }, error => console.error(error));

    events.subscribe('user:created', (user, time) => {
      this.getAppTye();
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      let type = this.network.type;
      this.setPlatformValue();
      //this.downloadLocationTrackingApk();
      if (type == "unknown" || type == "none" || type == undefined) {
        this.globalObjects.setOnlineStatus(true);
      } else {
        this.globalObjects.setOnlineStatus(true);
      }
      // this.checkPermission();
    });
  }


  checkPermission() {
    try {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
        result => {
          if (result.hasPermission == false) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
      );
    } catch (err) {
      console.log(err);
    }
    try {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(
        result => {
          if (result.hasPermission == false) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE)
      );
    } catch (err) {
      console.log(err);
    }
    try {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
        result => {
          if (result.hasPermission == false) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
      );
    } catch (err) {
      console.log(err);
    }
    try {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
        result => {
          if (result.hasPermission == false) {
            this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO);
          }
        },
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO)
      );
    } catch (err) {
      console.log(err);
    }


  }
  setPlatformValue() {
    if (this.platform.is('ios')) {
      this.globalObjects.setPlatformValue('ios');
    } else if (this.platform.is('android')) {
      this.globalObjects.setPlatformValue('android');
    }
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  getAppTye() {
    // console.log("ddddddddd"+this.globalObjects.getLocallData("userDetails"))
    if (this.globalObjects.getLocallData("userDetails")) {
      this.http.get(this.globalObjects.getScopeUrl() + "apptypelist?userCode=" + this.globalObjects.getLocallData("userDetails").user_code)
        .map(res => res.json()).subscribe(data => {
          this.appTypes = data.appTypes;
          if (this.appTypes) {
            if (this.appTypes.length > 1) {
              this.appTypes_flag = true;
            }
          }
          this.selectAppType = this.globalObjects.getLocallData("apptype");
          this.offline_flag_app_run = this.globalObjects.getOfflineFlag();
          if (data.entityCodes) {
            this.entityCodes = data.entityCodes;
            this.entity_code = this.globalObjects.getLocallData("userDetails").entity_code;
            if (this.entityCodes.length > 1) {
              this.entityCode_flag = true;
            }

          }
        },
        err => {
          console.log('error in ETPhoneHome');
        });
    } else {
    }

  }


  logOut() {
    this.globalObjects.destroyLocalData("userDetails");
    this.globalObjects.destroyLocalData("apptype");
    // this.globalObjects.destroyLocalData("scopeUrl");
    this.globalObjects.destroyLocalData("valueFormat");

    this.nav.setRoot('LoginPage');
  }
  exitAPP() {
    this.platform.exitApp(); // Exit from app
  }

  setAppType() {
    this.globalObjects.setDataLocally("apptype", this.selectAppType);
    this.nav.setRoot('HomePage');
  }


  openChangePassword() {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push('ChangePasswordPage');
  }
  refreshAppData() {
    this.nav.push('OfflineRefreshTabPage');
  }

  setEntityCode() {
    var u_details = this.globalObjects.getLocallData('userDetails');
    u_details.entity_code = this.entity_code;
    this.globalObjects.setDataLocally("userDetails", u_details);
    this.nav.setRoot('HomePage');
  }

  downloadLocationTrackingApk() {
    let directoryPath = "";
    let platformVal = this.globalObjects.getPlatformValue();
    if (platformVal) {
      if (platformVal == 'ios') {
        directoryPath = this.file.documentsDirectory;
      } else {
        directoryPath = this.file.externalRootDirectory;
      }
    } else {
      directoryPath = this.file.externalRootDirectory;
    }
    this.file.createDir(directoryPath, "DAV5_LC_APK", false).then(result => {
      this.fileDowloadToSpecificLocation(directoryPath);
    }, (err) => {
      this.fileDowloadToSpecificLocation(directoryPath);
    });
  }
  fileDowloadToSpecificLocation(directoryPath) {
    const fileTransfer: FileTransferObject = this.transfer.create();
    var pathUrl = directoryPath + "DAV5_LC_APK/" + "LHS_BLT_LocationTracking_LOC" + '.' + "apk";
    let url1 = "http://203.193.167.118:8888/LHSAppStore-1.0/doDownload?filePath=C:\LHSAppStore\LHS_BLT_LocationTracking_LOC.apk";
    fileTransfer.download(url1, pathUrl).then((entry) => {
    }, (error) => {
      this.globalObjects.displayCordovaToast(JSON.stringify(error));
    });
  }

}
