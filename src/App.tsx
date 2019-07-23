import { onError, Provider } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import SendIntentAndroid from 'react-native-send-intent';
import { Sentry } from 'react-native-sentry';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import AppLogic from './lib/AppLogic';
import { getLog } from './lib/CallLog';
import { Store } from './lib/Store';
import DetailsScreen from './screens/DetailsScreen';
import HomeScreen from './screens/HomeScreen';

onError((error) => {
  Sentry.captureException(error);
});

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

const store = new Store();

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
        ).check(getLog, store);

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
      },
      (error) => {
        Sentry.captureException(new Error(error.toString())); // TODO: see if this is an error object
      },
    );

    BackgroundFetch.status((status) => {
      switch (status) {
        default:
          Sentry.captureException(
            new Error(`BackgroundFetch status: ${status.toString()}`),
          );
          break;
        case BackgroundFetch.STATUS_AVAILABLE:
          break;
      }
    });

    // TODO: update contacts upon launch, for updated phone numbers (don't cache)
    // outline icons w/ white, for non-dark-mode UI
    // sorting in UI
    // settings
    // save to cloud
    // pick color
  }

  public render() {
    return (
      <Provider store={store}>
        <PaperProvider theme={theme}>
          <AppContainer />
        </PaperProvider>
      </Provider>
    );
  }
}

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'white',
  },
};
