import React, { Component } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';

interface Props {
  name: string;
  onChanged: (items: string[]) => void;
}

interface State {
  items: string[];
}

export default class DetailsScreen extends Component<Props, State> {
  public static navigationOptions = ({ navigation }) => {
    return {
      headerLeft: (
        <IconButton
          onPress={() => navigation.goBack()}
          icon='arrow-back'
          size={20}
        />
      ),
      title: 'Details',
    };
  }

  public render() {
    return <View />;
  }
}
