import React from 'react';
import { Text, View, Button } from 'react-native';
var SmsAndroid = require('react-native-sms-android');
import { PermissionsAndroid } from 'react-native';

export class DetailsScreen extends React.Component {
    static navigationOptions = {
      title: 'Details',
    };
    
    requestCameraPermission() {
        return PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            'title': 'Call Your Mom Camera Permission',
            'message': 'Call Your Mom needs access to your txt messages ' +
                       'so it can remind you to txt her.'
          }
        );
    }

    getTxts() {
      this.requestCameraPermission().then(() => {

        /* List SMS messages matching the filter */
        var filter = {
          box: 'sent',
          address: '4257856972', // sender's phone number
        };

        SmsAndroid.list(JSON.stringify(filter), (fail) => {
              console.log("OH Snap: " + fail)
          },
          (count, smsList) => {
              console.log('Count: ', count);
              console.log('List: ', smsList);
              var arr = JSON.parse(smsList);
              for (var i = 0; i < arr.length; i++) {
                  var obj = arr[i];
                  console.log("Index: " + i);
                  console.log("-->" + obj.date);
                  console.log("-->" + obj.body);
              }
          });
        });
    }

    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate('Home')}
          />
          <Button
            title="Get txts"
            onPress={() => this.getTxts()}
          />
        </View>
      );
    }
  }
