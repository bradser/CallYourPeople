import React from 'react';
import { AsyncStorage, Button, Text, View } from 'react-native';
import { Col, Row, Grid } from "react-native-easy-grid";

const colStyle = {height: 50, justifyContent: 'center', alignItems: 'center'};
const FBSDK = require('react-native-fbsdk');
const {
  LoginManager,
} = FBSDK;

export class HomeScreen extends React.Component {
    static navigationOptions = {
      title: 'Call Your Mom!',
    };
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center'}}>
          <Text>Call Me</Text>
          <Text>Grid Placeholder</Text>
          
            <Grid>
              <Col style={{  backgroundColor: 'red', ...colStyle }}>
                <Text>Name</Text>
              </Col>
              <Col style={{ backgroundColor: 'blue', ...colStyle }}>
                <Text>Time Until Contact</Text>
              </Col>
              <Col style={{ backgroundColor: 'green', ...colStyle }}>
                <Text>Edit</Text>
              </Col>
            </Grid>
          
          <Button title="Add"></Button>
          <Button title="Delete"></Button>
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