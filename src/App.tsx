import { Provider } from 'mobx-react';
import React, { Component } from 'react';
import BackgroundFetch from 'react-native-background-fetch';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import SendIntentAndroid from 'react-native-send-intent';
import Sentry from 'react-native-sentry';
import { createAppContainer, createStackNavigator } from 'react-navigation';
import Fremium from './lib/Fremium';
import { fremiumCheckedLaunchContact } from './lib/Helpers';
import { PeopleStoreImpl } from './lib/store/People';
import { RemindContactsStoreImpl } from './lib/store/RemindContacts';
import { SettingsStoreImpl } from './lib/store/Settings';
import DetailsScreen from './screens/DetailsScreen';
import HomeScreen from './screens/HomeScreen';

const appNavigator = createStackNavigator(
  {
    Details: DetailsScreen,
    Home: HomeScreen,
  },
  {
    initialRouteName: 'Home',
  },
);

// @ts-ignore: Must be capitalized as it's used in markup
const AppContainer = createAppContainer(appNavigator);

const peopleStore = new PeopleStoreImpl();
const remindContactsStore = new RemindContactsStoreImpl();
const settingsStore = new SettingsStoreImpl();

const fremium = new Fremium(peopleStore, settingsStore);
fremium.initialize().then(() => {
  PushNotification.configure({
    onNotification: async (notification) => {
      await fremiumCheckedLaunchContact(settingsStore, notification.tag);
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
      <Provider
        peopleStore={peopleStore}
        remindContactsStore={remindContactsStore}
        settingsStore={settingsStore}
      >
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
