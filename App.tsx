import React from "react";
import { createSwitchNavigator, createStackNavigator } from "react-navigation";

import { HomeScreen } from "./src/screens/HomeScreen";
import { DetailsScreen } from "./src/screens/DetailsScreen";
import { AuthLoadingScreen } from "./src/screens/AuthLoadingScreen";
import { SignInScreen } from "./src/screens/SignInScreen";
import { check } from './src/AppLogic';
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

BackgroundTask.define(() => {
  check().then(() =>  BackgroundTask.finish());
});
