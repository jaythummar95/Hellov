package com.hellov;
import android.content.Intent; 
import com.facebook.react.ReactActivity;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.ActivityInfo;
import android.content.pm.Signature;
import java.security.MessageDigest;
import android.util.Base64;
import android.util.Log;
import android.os.Bundle;

public class MainActivity extends ReactActivity {

  @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

         PackageInfo info;
        try {
            info = getPackageManager().getPackageInfo( getPackageName(), PackageManager.GET_SIGNATURES);
            for (Signature signature : info.signatures) {
                MessageDigest md;
                md = MessageDigest.getInstance("SHA");
                md.update(signature.toByteArray());
                String something = new String(Base64.encode(md.digest(), 0));
                //String something = new String(Base64.encodeBytes(md.digest()));
                Log.e("hash key", something);
            }
        } catch (Exception e){
            Log.e("hash key", "something");
            e.printStackTrace();
        }

    }
    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "Hellov";
    }

     @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
}
