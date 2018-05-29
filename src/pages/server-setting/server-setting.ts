
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams, ViewController, ModalController } from "ionic-angular";
import { FormGroup } from "@angular/forms";
import { GlobalObjectsProvider } from "../../providers/global-objects/global-objects";

@IonicPage()
@Component({
    selector: 'page-change-server-setting',
    templateUrl: 'serverSetting.html'
})
export class ServerSettingPage {
    settingForm: FormGroup;

    inputType: any = "password";
    loading: any;
    setting: any = {};
    constructor(public navCtrl: NavController, params: NavParams, public globalObjects: GlobalObjectsProvider, public viewCtrl: ViewController, public modalCtrl: ModalController) {

        this.setting.serverList = [
            "http://203.193.167.118:8888/",
            "http://203.193.167.116:8888/",
            "http://203.193.167.114:8181/",
            "http://203.193.167.117:8080/",
            "http://203.193.167.117:8888/",
            "http://192.168.100.240:8888/",
            "http://203.193.167.117:8888/",
            "http://203.193.167.117:8181/",
            "http://117.240.223.218:8080/",
            "http://192.168.100.143:8080/",
            "http://192.168.100.145:8080/",
            "http://180.151.87.156:8888/",
            "http://202.191.213.165:8888/",
            "http://192.168.0.174:8080/",
            "http://202.189.234.141/",
            "http://192.168.1.101:8080/",
            "http://182.74.133.170:8080/"
        ];

        this.setting.warList = ["DynamicAppWS", "DynamicAppWSPG", "DynamicAppWSV3", "DynamicAppWSPGReg"];
        this.setting.databaseList = [
            "CPGERP", "CPGTEST",
            "MAPLTEST", "RSIPMTEST",
            "BAIDVTEST", "PERTTEST",
            "ASHISH",
            "SONIERP", "SONIVERP", "SONIVTEST",
            "LHSISO", "LHS_MAPP", "STLTERP",
            "DILVERP1", "UNILEVER", "NETVISION", "ROHASERP", "TAGERP",
            "VDEMOERP", "JCTLERP", "SSLERP", "MANERP", "NA", "TAGTEST", "SSELERP"
        ];
        this.setting.dbEntityList = ["CP", "CPT", "MA", "RS", "BA", "PF", "AS", "SP", "LS", "BD", "TG",
            "ST", "DI", "NV", "UL", "SM", "JC", "SS", "MS", "RE", "SE"
        ]
        this.setting.dbUrlList = ["192.168.100.10", "172.1.0.2", "192.168.0.101", "192.168.100.173", "192.168.1.16", "192.168.0.174", "NA"];
        this.setting.portNoList = ["1521", "NA"];

    }

    hideShowPassword() {
        if (this.inputType == 'password') {
            this.inputType = 'text'
        } else { this.inputType = 'password' };
    };
    changeServerSetting(value) {
        if (value.dbEntity == "") {
            value.dbEntity = "NA"
        }
        if (value.dbUrl == "") {
            value.dbUrl = "NA"
        }
        if (value.portNo == "") {
            value.portNo = "NA"
        }
        if (value.databaseUser == "") {
            value.databaseUser = "NA"
        }
        var url = value.serverUrl + value.warName + "/webService/" + value.dbEntity + "/" + value.dbUrl + "/" + value.portNo + "/" + value.databaseUser + "/" + value.dbPassword + "/";

        this.globalObjects.setDataLocally("scopeUrl", url);
        this.globalObjects.setScopeUrl(url);
        this.viewCtrl.dismiss();
    }
    closeModal() {
        this.viewCtrl.dismiss();
    }
    setDbUser(entity) {
        if (entity == "CP") {
            this.setting.databaseUser = "CPGERP";
        } else if (entity == "JC") {
            this.setting.databaseUser = "JCTLERP";
        } else if (entity == "SS") {
            this.setting.databaseUser = "SSLERP";
        } else if (entity == "MS") {
            this.setting.databaseUser = "MANERP";
        } else if (entity == "CPT") {
            this.setting.databaseUser = "CPGTEST";
        } else if (entity == "MA") {
            this.setting.databaseUser = "MAPLTEST"
        } else if (entity == "RS") {
            this.setting.databaseUser = "RSIPMTEST"
        } else if (entity == "BA") {
            this.setting.databaseUser = "BAIDVTEST";
        } else if (entity == "PF") {
            this.setting.databaseUser = "PERTTEST"
        } else if (entity == "LS") {
            this.setting.databaseUser = "LHSISO"
        } else if (entity == "BD") {
            this.setting.databaseUser = "LHS_MAPP"
        } else if (entity == "DI") {
            this.setting.databaseUser = "DILVERP1"
        } else if (entity == "ST") {
            this.setting.databaseUser = "STLTERP"
        } else if (entity == "UL") {
            this.setting.databaseUser = "UNILEVER"
        } else if (entity == "NV") {
            this.setting.databaseUser = "NETVISION"
        } else if (entity == "SM") {
            this.setting.databaseUser = "VDEMOERP"
        } else if (entity == "AS") {
            this.setting.databaseUser = "ASHISH"
        } else if (entity == "SP") {
            this.setting.databaseUser = "SONIVERP"
        } else if (entity == "TG") {
            this.setting.databaseUser = "TAGERP"
        } else if (entity == "SE") {
            this.setting.databaseUser = "SSELERP"
        }
        else {
            this.setting.databaseUser = ""
        }
    }




}

