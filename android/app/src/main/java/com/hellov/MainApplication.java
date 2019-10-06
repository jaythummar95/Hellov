package com.hellov;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.heanoria.library.reactnative.locationenabler.RNAndroidLocationEnablerPackage;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.imagepicker.ImagePickerPackage;
import com.entria.views.RNViewOverflowPackage;
import com.kevinresol.react_native_default_preference.RNDefaultPreferencePackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.BV.LinearGradient.LinearGradientPackage;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage; 
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;

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
            new RNAndroidLocationEnablerPackage(),
            new PickerPackage(),
            new RNFirebasePackage(),
            new RNGoogleSigninPackage(),
            new FBSDKPackage(mCallbackManager),
            new ImageResizerPackage(),
            new ImagePickerPackage(),
            new RNViewOverflowPackage(),
            new RNDefaultPreferencePackage(),
            new RNDeviceInfo(),
            new LinearGradientPackage(),
            new RNGestureHandlerPackage(),
             new RNFirebaseMessagingPackage(),
             new RNFirebaseNotificationsPackage() 
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
    FacebookSdk.setApplicationId("1547968485337349");
     FacebookSdk.sdkInitialize(getApplicationContext());
    SoLoader.init(this, /* native exopackage */ false);
  }
}
