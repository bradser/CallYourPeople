import React from 'react';
import { Text, View } from 'react-native';
import FBLoginButton from './../components/FBLoginButton';

export class SignInScreen extends React.Component {
    static navigationOptions = {
      title: 'Call Your Mom!',
    };
  
    render() {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <FBLoginButton navigation={this.props.navigation} />
        </View>
      );
    }
  }