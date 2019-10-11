import moment from 'moment';
import { AppRegistry } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import codePush from 'react-native-code-push';
import PushNotification from 'react-native-push-notification-ce';
import Sentry, { SentrySeverity } from 'react-native-sentry';
import App from './src/App';
import { getLog } from './src/lib/CallLog';
import NotificationScheduler from './src/lib/NotificationScheduler';
import { PeopleStoreImpl } from './src/lib/store/People';
import { RemindContactsStoreImpl } from './src/lib/store/RemindContacts';

Sentry.config(
  'https://72a046a322314e0e8d387ff7a2ca1ab6@sentry.io/1410623'
).install();

const MyHeadlessTask = async () => {
  const peopleStore = new PeopleStoreImpl();
  const remindContactsStore = new RemindContactsStoreImpl();
  const log = await getLog();

  Sentry.captureBreadcrumb({
    category: 'Scheduling',
    message: 'MyHeadlessTask',
    level: SentrySeverity.Info
  });

  await new NotificationScheduler(peopleStore, remindContactsStore, details =>
    PushNotification.localNotification(details)
  ).notifyStoredSetReminders(moment(), log);

  BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
};

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);

let codePushOptions = { checkFrequency: codePush.CheckFrequency.ON_APP_RESUME };

AppRegistry.registerComponent('CallYourPeople', () =>
  codePush(codePushOptions)(App)
);
