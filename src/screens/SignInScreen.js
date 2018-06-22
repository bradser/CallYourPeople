import React from 'react';
import { View } from 'react-native';
import FBLoginButton from './../components/FBLoginButton';

export class SignInScreen extends React.Component {
    static navigationOptions = {
      title: 'Please sign in',
    };
  
    render() {
      return (
        <View>
          <FBLoginButton navigation={this.props.navigation} />
        </View>
      );
    }
  }