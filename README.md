# Push Notifications

Push notifications for iOS only works when you run application on real device, because server has only production certs.


# Development

You need to have installed `gulp` globally.

Install node dependencies by running `npm install`.

### Android

#### Running on device:

```
    node_modules/ionic/bin/ionic run android
```

### iOS

#### Running on device

Prepare ios version:

```
    node_modules/ionic/bin/ionic prepare ios
```

Open `platforms/ios/Don Buscalo.xcodeproj` in XCode

#### Running on simulator 

```
    node_modules/ionic/bin/ionic run ios
```


# Publishing to Stores

## Android using `release-signing.properties`

Create `release-signing.properties` file in `platforms/android/` directory.

```
    # You can copy sample file
    cp platforms/android/release-signing.properties.sample platforms/android/release-signing.properties
```

Update `release-signing.properties` properties (i.e. keystore location, alias, passwords).

Build Android application:

```
    node_modules/ionic/bin/ionic build android --release
```

Signed apks will be in `platforms/android/build/outputs/apk/` directory.

## Android manual signing

You can use it only if there is no `release-signing.properties`  file in `platforms/android` directory.

```
    $ node_modules/ionic/bin/ionic build android --release

    $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore app.keystore platforms/android/build/outputs/apk/android-armv7-release-unsigned.apk app-key
    $ jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore app.keystore platforms/android/build/outputs/apk/android-x86-release-unsigned.apk app-key
    $ /path/to/sdk/build-tools/zipalign -v 4 android-armv7-release-unsigned.apk DonBuscalo-armv7.apk
    $ /path/to/sdk/build-tools/zipalign -v 4 android-x86-release-unsigned.apk DonBuscalo-x86.apk
```

Where `app-key` is alias from your keystore.


## iOS

Prepare ios version:

```
    node_modules/ionic/bin/ionic prepare ios
```

Open `platforms/ios/Don Buscalo.xcodeproj` in XCode

Use `Studio Tigers GmbH` as team, otherwise push notifications won't work.


[Ionic](http://ionicframework.com/docs/guide/publishing.html "iconic android")