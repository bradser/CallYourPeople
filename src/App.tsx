import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import { NativeModules } from 'react-native';
import BackgroundFetch from 'react-native-background-fetch';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import SendIntentAndroid from 'react-native-send-intent';
import Sentry from 'react-native-sentry';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import { contactLink } from './components/Link';
import Fremium from './lib/Fremium';
import { Store } from './lib/Store';
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

const store = new Store();

const fremium = new Fremium(store);
fremium.initialize().then(() => {
  PushNotification.configure({
    onNotification: (notification) => {
      if (store.settings.isPremium) {
        contactLink(notification.tag);
      } else {
        NativeModules.Ads.showInterstitial().then(() =>
          contactLink(notification.tag),
        );
      }
    },
  });
});

export default class App extends Component {
  public async componentDidMount() {
    SendIntentAndroid.requestIgnoreBatteryOptimizations();

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
    // reminder schedule
    // voice mail length
    // voice mail reminder length
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
