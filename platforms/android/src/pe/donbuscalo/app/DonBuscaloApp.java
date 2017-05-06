package pe.donbuscalo.app;

import android.app.Application;
import com.parse.Parse;
import com.parse.PushService;
import com.parse.ParseInstallation;
import android.util.Log;

public class DonBuscaloApp extends Application {
    @Override
    public void onCreate() {
        super.onCreate();
        Parse.setLogLevel(Log.VERBOSE);
        Parse.initialize(new Parse.Configuration.Builder(this)
            .applicationId("GcoMAqZyIDm1H8ARkBq7PZpDtF0sg7svPDG2Dk4n")
            .clientKey("rL3o5JR4us5bW8sp6O2Cqc4gld9wnKOZyObPZIEE")
            .server("https://api.donbuscalo.pe/parse/")
            .build()
        );
        ParseInstallation.getCurrentInstallation().saveInBackground();
    }
}