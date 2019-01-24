import * as appSettings from "application-settings";
import {
    AD_SIZE,
    createBanner,
    createInterstitial,
    hideBanner,
    preloadInterstitial,
    showInterstitial
} from "nativescript-admob";
import { screen } from "platform";
import { Observable } from "tns-core-modules/data/observable";
import { isIOS } from "tns-core-modules/platform";
import * as constantsModule from "../shared/constants";
import { HttpService } from "./http.service";

export class AdService {

    get showAd(): boolean {
        return this._showAd;
    }

    set showAd(showAd: boolean) {
        this._showAd = showAd;
    }

    static _testing = true;

    static getInstance(): AdService {
        return AdService._instance;
    }

    private static _instance: AdService = new AdService();
    private _showAd: boolean;

    constructor() {
        this._showAd = true;
        if (!appSettings.hasKey(constantsModule.PREMIUM)) {
            HttpService.getInstance().showAds().then((show) => {
                this._showAd = show === "true";
            });
        } else {

            this._showAd = false;
        }
    }

    showInterstitial() {
        if (this._showAd) {
            this.doShowInterstitial();
        }
    }

    showSmartBanner(): Promise<void> {
        if (this._showAd) {
            return this.doCreateSmartBanner();
        }
    }

    hideAd() {
        if (this._showAd) {
            hideBanner().then(
                () => console.log("Banner hidden"),
                (error) => console.error("Error hiding banner: " + error)
            );
        }
    }

    getAdHeight(): number {
        let height = 32;
        const screenHeight: number = screen.mainScreen.heightDIPs;
        if (screenHeight > 400 && screenHeight < 721) {
            height = 50;
        } else if (screenHeight > 720) {
            height = 90;
        }

        return height;
    }

    doCreateSmartBanner(): Promise<void> {
        return this.createBanner(AD_SIZE.SMART_BANNER);
    }

    /*doCreateSkyscraperBanner(): void {
        this.createBanner(AD_SIZE.SKYSCRAPER);
    }

    doCreateLargeBanner(): void {
        this.createBanner(AD_SIZE.LARGE_BANNER);
    }

    doCreateRegularBanner(): void {
        this.createBanner(AD_SIZE.BANNER);
    }

    doCreateRectangularBanner(): void {
        this.createBanner(AD_SIZE.MEDIUM_RECTANGLE);
    }

    doCreateLeaderboardBanner(): void {
        this.createBanner(AD_SIZE.LEADERBOARD);
    }*/

    doShowInterstitial(): void {
        showInterstitial().then(
            () => console.log("Shown interstetial..."),
            (error) => console.log("Error showing interstitial", error)
        );
    }

    doPreloadInterstitial(resolve, reject): void {
        preloadInterstitial({
            testing: AdService._testing,
            iosInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
            androidInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
            onAdClosed: () => {
                this.doPreloadInterstitial(resolve, reject);
            }
        }).then(
            () => {
                console.log("Interstitial preloaded");
                resolve();
            },
            (error) => {
                console.log("Error preloading interstitial: " + error);
                reject(error);
            }
        );

    }

    doCreateInterstitial(): void {
        createInterstitial({
            testing: AdService._testing,
            iosInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
            androidInterstitialId: constantsModule.INTERSTITIAL_AD_ID,
            onAdClosed: () => {
                console.log("doCreate Closed...");
            }
        }).then(
            () => console.log("Interstitial created"),
            (error) => console.error("Error creating interstitial: " + error)
        );
    }

    private createBanner(size: AD_SIZE): Promise<void> {
        return createBanner({
            testing: AdService._testing,
            // if this 'view' property is not set, the banner is overlayed on the current top most view
            // view: ..,
            size,
            iosBannerId: constantsModule.BANNER_AD_ID,
            androidBannerId: constantsModule.BANNER_AD_ID, // our registered banner id
            // Android automatically adds the connected device as test device with testing:true, iOS does not
            // iosTestDeviceIds: ["yourTestDeviceUDIDs", "canBeAddedHere"],
            margins: {
                // if both are set, top wins
                // top: 10
                bottom: isIOS ? 50 : 0
            },
            keywords: ["game", "education"]
        });
    }
}
