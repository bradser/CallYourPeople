import moment from 'moment';
import React, { Component } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { MenuProvider } from 'react-native-popup-menu';
import PushNotification from 'react-native-push-notification-ce';
import SendIntentAndroid from 'react-native-send-intent';
import { Sentry } from 'react-native-sentry';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import AppLogic from './AppLogic';
import { getLog } from './CallLog';
import DetailsScreen from './screens/DetailsScreen';
import HomeScreen from './screens/HomeScreen';

const AppNavigator = createStackNavigator(
  {
    Details: DetailsScreen,
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends Component {
  public componentDidMount() {
    SendIntentAndroid.requestIgnoreBatteryOptimizations();

    BackgroundFetch.configure(
      {
        enableHeadless: true,
        minimumFetchInterval: 12 * 60,
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
        <AppContainer />
      </MenuProvider>
    );
  }
}
