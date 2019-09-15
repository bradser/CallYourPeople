package com.poseablesoftware.callyourpeople;

import com.amazon.device.ads.Ad;
import com.amazon.device.ads.AdError;
import com.amazon.device.ads.AdProperties;
import com.amazon.device.ads.AdRegistration;
import com.amazon.device.ads.DefaultAdListener;
import com.amazon.device.ads.InterstitialAd;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

public class AdsModule extends ReactContextBaseJavaModule {
    private static ReactApplicationContext reactContext;
    private InterstitialAd interstitialAd;

    AdsModule(ReactApplicationContext context) {
        super(context);
        reactContext = context;

        //AdRegistration.enableTesting(true);
        //AdRegistration.enableLogging(true);

        AdRegistration.setAppKey(reactContext.getResources().getString(R.string.amazon_ad_app_key));
        AdRegistration.registerApp(context);
    }

    @Override
    public String getName() {
        return "Ads";
    }

    @ReactMethod
    public void showInterstitial(Promise promise) {
        this.interstitialAd = new InterstitialAd(reactContext);

        this.interstitialAd.setListener(new MyCustomAdListener(promise));

        this.interstitialAd.loadAd();
    }

    class MyCustomAdListener extends DefaultAdListener {
        private Promise promise;

        public MyCustomAdListener(Promise promise) {
            this.promise = promise;
        }

        @Override
        public void onAdLoaded(Ad ad, AdProperties adProperties) {
            if (ad == AdsModule.this.interstitialAd) {
                // Show the interstitial ad to the app's user.
                // Note: While this implementation results in the ad being shown
                // immediately after it has finished loading, for smoothest user
                // experience you will generally want the ad already loaded
                // before it’s time to show it. You can thus instead set a flag
                // here to indicate the ad is ready to show and then wait until
                // the best time to display the ad before calling showAd().
                AdsModule.this.interstitialAd.showAd();
            }
        }

        @Override
        public void onAdCollapsed(Ad ad) {
            this.promise.resolve(true);
        }

        @Override
        public void onAdExpired(Ad ad) {
            this.promise.resolve(false);
        }

        @Override
        public void onAdFailedToLoad(Ad ad, AdError error) {
            this.promise.resolve(error.getMessage());
        }

        @Override
        public void onAdDismissed(Ad ad) {
            this.promise.resolve(true);
        }
    }
}
