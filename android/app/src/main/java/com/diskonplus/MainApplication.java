package com.diskonplus;

import android.app.Application;
import android.util.Log;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

/* react native admob */
import com.sbugert.rnadmob.RNAdMobPackage;

/* react native android badge */
import me.jhen.react.BadgePackage;

/* raect native fbsdk */
import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;

/* react native fcm */
import com.evollu.react.fcm.FIRMessagingPackage;

/* react native google signin */
import co.apptailor.googlesignin.RNGoogleSigninPackage;

/* react native image picker */
import com.imagepicker.ImagePickerPackage;

/* react native linear gradient */
import com.BV.LinearGradient.LinearGradientPackage;

/* react native maps */
import com.airbnb.android.react.maps.MapsPackage;

/* react native photo view */
import com.reactnative.photoview.PhotoViewPackage;

/* react native picker */
import com.beefe.picker.PickerViewPackage;

/* react native share */
import cl.json.RNSharePackage;

/* react native system notification*/
import io.neson.react.notification.NotificationPackage;


public class MainApplication extends Application implements ReactApplication {

  /* react native fbsdk */
  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }
  /**/

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    protected boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),

          /* react native admob */
          new RNAdMobPackage(),

          /* react native android badge */
          new BadgePackage(),

          /* react native fbsdk */
          new FBSDKPackage(mCallbackManager),

          /* react native fcm */
          new FIRMessagingPackage(),
          
          /* react native google signin */
          new RNGoogleSigninPackage(),

          /* react native image picker */
          new ImagePickerPackage(),

          /* react native linear gradient */
          new LinearGradientPackage(),

          /* react native maps */
          new MapsPackage(),

          /* react native photo view */
          new PhotoViewPackage(),

          /* react native picker */
          new PickerViewPackage(),

          /* react native share */
          new RNSharePackage(),

          /* react native system notification */
          new NotificationPackage()
      );
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

    /* react native fbsdk */
    FacebookSdk.sdkInitialize(getApplicationContext());
    // If you want to use AppEventsLogger to log events.
    // AppEventsLogger.activateApp(this);
  }

}
