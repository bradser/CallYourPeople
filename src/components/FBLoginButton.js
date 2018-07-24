import React from 'react';
import { AsyncStorage, View } from 'react-native';
import { LoginButton } from 'react-native-fbsdk';

export default class FBLoginButton extends React.Component {
  render() {
    return (
      <View>
        <LoginButton
          readPermissions={["email"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert("Login failed with error: " + error.message);
              } else if (result.isCancelled) {
                alert("Login was cancelled");
              } else {
                AsyncStorage.setItem('loggedIn', 'true');
                this.props.navigation.navigate('App');

                alert("Login was successful with permissions: " + result.grantedPermissions)
              }
            }
          }
          onLogoutFinished={() => alert("User logged out")} />
      </View>
    );
  }
};

module.exports = FBLoginButton;