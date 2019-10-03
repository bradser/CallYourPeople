import * as Sentry from '@sentry/react-native';
import moment from 'moment';
import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import codePush from 'react-native-code-push';
import PushNotification from 'react-native-push-notification-ce';
import App from './src/App';
import { getLog } from './src/lib/CallLog';
import NotificationScheduler from './src/lib/NotificationScheduler';
import { Store } from './src/lib/Store';

Sentry.init({
  dsn: 'https://72a046a322314e0e8d387ff7a2ca1ab6@sentry.io/1410623'
});

const MyHeadlessTask = async () => {
  const store = new Store();
  const log = await getLog();

  await new NotificationScheduler(details =>
    PushNotification.localNotification(details)
  ).invoke(store, log, moment());

  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

AppRegistry.registerComponent('CallYourPeople', () =>
  codePush(codePushOptions)(App)
);
