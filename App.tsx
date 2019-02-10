import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AuthLoadingScreen } from "./src/screens/AuthLoadingScreen";
import { SignInScreen } from "./src/screens/SignInScreen";
import AppLogic from './src/AppLogic';
import { Linking } from 'react-native';
import { NotificationsAndroid } from 'react-native-notifications';
import BackgroundFetch from "react-native-background-fetch";

const AppStack = createStackNavigator({
  Home: HomeScreen,
});

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  }
);


export default class App extends React.Component {
  componentDidMount() {
    BackgroundFetch.configure({
      minimumFetchInterval: 15,
      stopOnTerminate: false,
      startOnBoot: true,
      enableHeadless: true
    }, () => {
      console.log("[js] Received background-fetch event");
      // Required: Signal completion of your task to native code
      // If you fail to do this, the OS can terminate your app
      // or assign battery-blame for consuming too much background-time
      BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
    }, (error) => {
      console.log("[js] RNBackgroundFetch failed to start");
    });

    // Optional: Query the authorization status.
    BackgroundFetch.status((status) => {
      switch(status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log("BackgroundFetch restricted");
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log("BackgroundFetch denied");
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log("BackgroundFetch is enabled");
          break;
      }
    });
  }

  render() {
    return <RootStack />;
  }
}

NotificationsAndroid.setNotificationOpenedListener((notification) => {
  if (notification.data.extra) {
    Linking.openURL('tel://' + notification.data.extra);
  }
});

BackgroundFetch.registerHeadlessTask(async () => {
  NotificationsAndroid.localNotification({ "title": "Test", "body": new Date().toString() });

  //await new AppLogic(NotificationsAndroid.localNotification).check();

  BackgroundFetch.finish();
})
