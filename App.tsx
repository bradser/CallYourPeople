import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";
import { HomeScreen } from "./src/screens/HomeScreen";
import { DetailsScreen } from "./src/screens/DetailsScreen";
import { AuthLoadingScreen } from "./src/screens/AuthLoadingScreen";
import { SignInScreen } from "./src/screens/SignInScreen";
import AppLogic from './src/AppLogic';
import { Linking } from 'react-native';
import { NotificationsAndroid } from 'react-native-notifications';
import BackgroundTask from 'react-native-background-task';

const AppStack = createStackNavigator({
  Home: HomeScreen,
  Details: DetailsScreen
});

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: "AuthLoading",
    headerStyle: {
      backgroundColor: "#f4511e"
    },
    headerTintColor: "#fff",
    headerTitleStyle: {
      fontWeight: "bold"
    }
  }
);

export default class App extends React.Component {
  componentDidMount() {
    BackgroundTask.schedule( { period: 8 * 60 * 60 }); // 8 hours
  }

  render() {
    return <RootStack />;
  }
}


NotificationsAndroid.setNotificationOpenedListener((notification) => {
  Linking.openURL('tel://' + notification.data.extra);
});


BackgroundTask.define(() => {
  new AppLogic(NotificationsAndroid.localNotification)
    .check()
    .then(() =>  BackgroundTask.finish());
});
