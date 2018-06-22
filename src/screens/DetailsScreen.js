import React from 'react';
import { Text, View, Button } from 'react-native';

export class DetailsScreen extends React.Component {
    static navigationOptions = {
      title: 'Details',
    };
  
    render() {
      return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text>Details Screen</Text>
          <Button
            title="Go to Home"
            onPress={() => this.props.navigation.navigate('Home')}
          />
        </View>
      );
    }
  }
