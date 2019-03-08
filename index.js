import { AppRegistry, Linking } from "react-native";
import BackgroundFetch from "react-native-background-fetch";
import PushNotification from "react-native-push-notification";
import { Sentry } from 'react-native-sentry';
import AppLogic from "./src/AppLogic";
import { getLog } from "./src/CallLog";
import App from "./src/App";

Sentry.config('https://72a046a322314e0e8d387ff7a2ca1ab6@sentry.io/1410623').install();

const MyHeadlessTask = async () => {
  await new AppLogic((details) => PushNotification.localNotification(details)).check(getLog);

  BackgroundFetch.finish();
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

AppRegistry.registerComponent("CallYourPeople", () => App);

PushNotification.configure({
  onNotification: (notification) => {
    if (notification.tag) {
      Linking.openURL(`tel:${notification.tag}`);
    }
  },

  requestPermissions: true,
});
