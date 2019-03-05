package com.caseycooper.callyourmom;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.burnweb.rnsendintent.RNSendIntentPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.transistorsoft.rnbackgroundfetch.RNBackgroundFetchPackage;
import com.streem.selectcontact.SelectContactPackage;
import com.wscodelabs.callLogs.CallLogPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;
import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
            new RNSendIntentPackage(),
            new AsyncStoragePackage(),
            new VectorIconsPackage(),
            new RNBackgroundFetchPackage(),
            new SelectContactPackage(),
          new CallLogPackage(),
              new ReactNativePushNotificationPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    SoLoader.init(this, /* native exopackage */ false);

    FacebookSdk.sdkInitialize(getApplicationContext());

    AppEventsLogger.activateApp(this);
  }
}
