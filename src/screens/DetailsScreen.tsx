import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { Store } from '../lib/Store';

interface Props {
  store?: Store;
  name: string;
  onChanged: (items: string[]) => void;
}

interface State {
  items: string[];
}

export default inject('store')(
  observer(
    class DetailsScreen  extends Component<Props, State> {
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

      private frequencyOnSelect = (person, index) => {
        /*this.props.store.setFrequency(person, index);

        this.checkAndNotify();*/
      }
    },
  ),
);
