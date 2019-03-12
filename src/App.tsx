import moment from 'moment';
import React from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { MenuProvider } from 'react-native-popup-menu';
import PushNotification from 'react-native-push-notification';
import SendIntentAndroid from 'react-native-send-intent';
import { Sentry } from 'react-native-sentry';
import AppLogic from './AppLogic';
import { getLog } from './CallLog';
import { HomeScreen } from './screens/HomeScreen';

export default class App extends React.Component {
  public componentDidMount() {
    SendIntentAndroid.requestIgnoreBatteryOptimizations();

    BackgroundFetch.configure(
      {
        enableHeadless: true,
        minimumFetchInterval: 6 * 60,
        startOnBoot: true,
        stopOnTerminate: false,
      },
      async () => {
        await new AppLogic(
          (details) => PushNotification.localNotification(details),
          moment(),
        ).check(getLog);

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
      },
      (error) => {
        Sentry.captureException(new Error(error.toString()));
      },
    );

    BackgroundFetch.status((status) => {
      switch (status) {
        default:
          Sentry.captureException(new Error(`BackgroundFetch status: ${status.toString()}`));
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          break;
      }
    });
  }

  public render() {
    return (
      <MenuProvider>
        <HomeScreen />
      </MenuProvider>
    );
  }
}
