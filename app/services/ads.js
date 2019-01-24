var application = require("tns-core-modules/application");
var admob = require("./admob-common");
var admobModule = require("nativescript-admob");

// need to cache this baby since after an Interstitial was shown a second won't resolve the activity
admob.activity = null;

admob._md5 = function (input) {
    try {
        var digest = java.security.MessageDigest.getInstance("MD5");
        var bytes = [];
        for (var j = 0; j < input.length; ++j) {
            bytes.push(input.charCodeAt(j));
        }

        var s = new java.lang.String(input);
        digest.update(s.getBytes());
        var messageDigest = digest.digest();
        var hexString = "";
        for (var i = 0; i < messageDigest.length; i++) {
            var h = java.lang.Integer.toHexString(0xFF & messageDigest[i]);
            while (h.length < 2)
                h = "0" + h;
            hexString += h;
        }
        return hexString;

    } catch (noSuchAlgorithmException) {
        console.log("error generating md5: " + noSuchAlgorithmException);
        return null;
    }
};

admob._getActivity = function () {
    if (admob.activity === null) {
        admob.activity = application.android.foregroundActivity;
    }
    return admob.activity;
};

admob._buildAdRequest = function (settings) {
    var builder = new com.google.android.gms.ads.AdRequest.Builder();
    if (settings.testing) {
        builder.addTestDevice(com.google.android.gms.ads.AdRequest.DEVICE_ID_EMULATOR);
        // This will request test ads on the emulator and device by passing this hashed device ID.
        var ANDROID_ID = android.provider.Settings.Secure.getString(admob._getActivity().getContentResolver(), android.provider.Settings.Secure.ANDROID_ID);
        var deviceId = admob._md5(ANDROID_ID);
        if (deviceId !== null) {
            deviceId = deviceId.toUpperCase();
            builder.addTestDevice(deviceId);
        }
    }

    if (settings.keywords !== undefined && settings.keywords.length > 0) {
        for (var i = 0; i < settings.keywords.length; i++) {
            builder.addKeyword(settings.keywords[i]);
        }
    }

    var bundle = new android.os.Bundle();
    bundle.putInt("nativescript", 1);
    var adextras = new com.google.android.gms.ads.mediation.admob.AdMobExtras(bundle);
    //builder = builder.addNetworkExtras(adextras);
    return builder.build();
};

admob.preloadVideoAd = function (arg, rewardCB, reload, afterAdLoaded) {
    return new Promise(function (resolve, reject) {
        try {
            var settings = admob.merge(arg, admob.defaults);
            admob.videoView = com.google.android.gms.ads.MobileAds.getRewardedVideoAdInstance(admob._getActivity());

            // Interstitial ads must be loaded before they can be shown, so adding a listener
            var InterstitialAdListener = com.google.android.gms.ads.reward.RewardedVideoAdListener.extend({
                onRewarded(reward) {
                    console.log("onRewarded! currency: " + reward.getType() + "  amount: " + reward.getAmount());
                    rewardCB(reward);
                },
                onRewardedVideoAdLeftApplication() {
                    console.log("onRewardedVideoAdLeftApplication");
                },
                onRewardedVideoAdClosed() {
                    console.log("onRewardedVideoAdClosed");
                    /*if (admob.videoView) {
                        admob.videoView.setRewardedVideoAdListener(null);
                        admob.videoView = null;
                    }*/
                    console.log("Calling reload..");
                    reload();
                },
                onRewardedVideoAdFailedToLoad(errorCode) {
                    console.log("onRewardedVideoAdFailedToLoad", errorCode);
                    reject(errorCode);
                    reload();
                },
                onRewardedVideoAdLoaded() {
                    afterAdLoaded();
                    resolve();
                },
                onRewardedVideoAdOpened() {
                    console.log("onRewardedVideoAdOpened");
                },
                onRewardedVideoStarted() {
                    console.log("onRewardedVideoStarted");
                },
                onRewardedVideoCompleted() {
                    console.log("onRewardedVideoCompleted");
                }
            });
            admob.videoView.setRewardedVideoAdListener(new InterstitialAdListener());

            console.log("settings.androidInterstitialId:: " + settings.androidInterstitialId);
            var ad = admob._buildAdRequest(settings);
            admob.videoView.loadAd(settings.androidInterstitialId, ad);
        } catch (ex) {
            console.log("Error in admob.preloadVideoAd: " + ex);
            reject(ex);
        }
    });
};

admob.showVideoAd = function () {
    return new Promise(function (resolve, reject) {
        try {
            if (admob.videoView) {
                admob.videoView.show();
                resolve();
            } else {
                reject("Please call 'preloadVideoAd' first.");
            }
        } catch (ex) {
            console.log("Error in admob.showVideoAd: " + ex);
            reject(ex);
        }
    });
};

module.exports = admob;