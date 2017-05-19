package com.diskonplus;

import com.facebook.react.ReactActivity;

/* react native fbsdk */
import android.content.Intent;

public class MainActivity extends ReactActivity {

    /* react native fcm */
    @Override
    public void onNewIntent (Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
    }
    /**/

	/* react native fbsdk */
	@Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        MainApplication.getCallbackManager().onActivityResult(requestCode, resultCode, data);
    }
	/**/

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "DiskonPlus";
    }
}
