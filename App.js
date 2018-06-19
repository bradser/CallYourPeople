import React from 'react';
import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import { HomeScreen } from './HomeScreen';
import { DetailsScreen } from './DetailsScreen';
import { AuthLoadingScreen } from './AuthLoadingScreen';
import { SignInScreen } from './SignInScreen';

const AppStack = createStackNavigator({ Home: HomeScreen, Details: DetailsScreen });

const AuthStack = createStackNavigator({ SignIn: SignInScreen });

const RootStack = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
    headerStyle: {
      backgroundColor: '#f4511e',
    },
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  }
);


export default class App extends React.Component {
  render() {
    return <RootStack />;
  }
}
