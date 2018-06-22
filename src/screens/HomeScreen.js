import React from 'react';
import { AsyncStorage, Button, View } from 'react-native';

const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

export class HomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Welcome to the app!',
    };
  
    render() {
      return (
        <View>
          <Button title="Show me more of the app" onPress={this._showMoreApp} />
          <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
        </View>
      );
    }
  
    _showMoreApp = () => {
      this.props.navigation.navigate('Details');
    };
  
    _signOutAsync = async () => {
      LoginManager.logOut();

      await AsyncStorage.clear();
      
      this.props.navigation.navigate('Auth');
    };
  }