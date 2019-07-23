import moment from 'moment';
import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import codePush from 'react-native-code-push';
import PushNotification from 'react-native-push-notification-ce';
import { Sentry } from 'react-native-sentry';
import { getLog } from './src//lib/CallLog';
import App from './src/App';
import { contactLink } from './src/components/Link';
import AppLogic from './src/lib/AppLogic';
import { Store } from './src/lib/Store';

Sentry.config(
  'https://72a046a322314e0e8d387ff7a2ca1ab6@sentry.io/1410623'
).install();

const MyHeadlessTask = async () => {
  const store = new Store();

  await new AppLogic(
    details => PushNotification.localNotification(details),
    moment()
  ).check(getLog, store);

  BackgroundFetch.finish();
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

PushNotification.configure({
  onNotification: notification => {
    contactLink(notification.tag);
  }
});

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

AppRegistry.registerComponent('CallYourPeople', () => codePush(codePushOptions)(App));
