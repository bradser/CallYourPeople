import React from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import PushNotification from 'react-native-push-notification';
import SendIntentAndroid from 'react-native-send-intent';
import { getLog } from './CallLog';
import { HomeScreen } from './screens/HomeScreen';
import AppLogic from './AppLogic';

export default class App extends React.Component {
  componentDidMount() {
    SendIntentAndroid.requestIgnoreBatteryOptimizations();

    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15, //6 * 60,
        stopOnTerminate: false,
        startOnBoot: true,
        enableHeadless: true
      },
      async () => {
        await new AppLogic(details =>
          PushNotification.localNotification(details)
        ).check(getLog);

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
      },
      error => {
        console.log('[js] RNBackgroundFetch failed to start ' + error);
      }
    );

    // Optional: Query the authorization status.
    BackgroundFetch.status(status => {
      switch (status) {
        case BackgroundFetch.STATUS_RESTRICTED:
          console.log('BackgroundFetch restricted');
          break;
        case BackgroundFetch.STATUS_DENIED:
          console.log('BackgroundFetch denied');
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          console.log('BackgroundFetch is enabled');
          break;
      }
    });
  }

  render() {
    return <HomeScreen />;
  }
}
