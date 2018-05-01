# TemPool
(https://github.com/Johnlim72/tempoolproject)

* TemPool is a peer-to-peer car pool transportation application, available both on iOS and Android mobile devices, 
catered to Temple University students and faculty. 
* There are two types of users of this app: a driver and a rider. 
* A simple, but powerful car pool matching algorithm running at the server back-end finds the optimal matching between a driver and a rider.
* A driver will input their leaving times into the app, waiting for a request from a rider. 
* Riders will be able to request rides to campus and can be picked up at their current location or any other location by the best suitable driver. 
* Riders would be able to find a ride at the earliest convenience or even schedule a ride for later in the day, or the next day. 
* Drivers would be able to see directions and the distance to their riders powered on a Google map. 
* Riders would also be able to see these directions and track the driver as they are approaching to them.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites and Installing in Order to Start Android Application in Windows

Install Node, Phython 2, via Chocolatey and a recent version of Java SE Development Kit (JDK)

```
choco install -y nodejs.install python2 jdk8
```

Install React Native CLI (command line interface)

```
npm install -g react-native-cli
```

Install Android Studio in order to use an Android Virtual Device and Android SDK Platform here: https://developer.android.com/studio/
Make sure to download Android SDK, Android SDK Platform, Performance (Intel HAXM) and Android Virtual Device during installation. 

Open Android Studio and open the SDK Manager in settings. Check the box next to "Show Package Details". Expand Android 7.0 (Nougat) and check
Google APIs, Android SDK Platform, Intel x86 Atom_64 System Image, and Google APIs Intel x86 Atom-64 System Image.

Open System and Security in the Control Panel and then Change settings. Open the Advanced Tab and click on Environment Variables. Click on New...
to create a new ANDROID_HOME user variable that points to the path to your Android SDK.

Example:
```
c:\Users\YOUR_USERNAME\AppData\Local\Android\Sdk
```

Open Android Studio and go to AVD Manager. If you don't have an Android Virtual Device, create one. Select the x86 Image Nougat targeting Android 7.0.

Go to the root directory of tempoolproject-master in Command Prompt and run:

```
cd tempoolproject-master
npm install
```

Once that is finished, open your Android Virtual Device or plug in your Android Phone and run this to start application:

```
react-native run-android
```
You should be able to start TemPool on Android!

### Prerequisites and Installing in Order to Start iOS Application on MacOS

Install dependencies: Node, Watchman, React Native CLI and XCode. 
You can install Node and Watchman with Homebrew (https://brew.sh/). 

```
brew install node
brew install watchman
```

Install the React Native CLI:

```
npm install -g react-native-cli
```

Install Xcode through Mac App Store. This will install the iOS Simulator and the necessary tools to build the iOS App.

Go into the root directory of tempoolproject-master and run:

```
cd tempoolproject-master
npm install
react-native run-ios
```

You should be able to start TemPool on iOS!

### PHP Scripts

The PHP scripts that are included in the .zip file are all hosted on cis-linux2.temple.edu/tuf41055. If user tuf41055
is removed from Temple University's system, the PHP scripts will have to be hosted on another server in order for the application
to fetch and post to the database.

### AWS Database Server
The MySQL Database in hosted on Stanley Wong's Amazon Web Services account. If this account were to shut down, the PHP scripts will
not be able to connect to the database, and the tables would need to be made in another database on another service that is identical to 
the tables in Stanley Wong's AWS Database.

### Bugs

* Multiple Android Back Button presses causes Application to crash, press the home button within the application instead.
* Tracking after picking up rider could go back to initial location right before getting next location

## Authors

* **John Lim** - (https://github.com/Johnlim72)
* **Monil Bid** - (https://github.com/monilbid)
* **Deevena Nikerle** - (https://github.com/vulcansparkle)
* **Shannon Jacobson** - (https://github.com/sjacobson456)
* **Jessica Nwaogbe** - (https://github.com/jnwaogbe)
* **Stanley Wong** - (https://github.com/WStan271)
* **Qi Chen** - (https://github.com/chuckchen4)

See also the list of [contributors](https://github.com/Johnlim72/tempoolproject/graphs/contributors) who participated in this project.


