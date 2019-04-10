import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import { Divider, IconButton, Text, Title } from 'react-native-paper';
import { NavigationInjectedProps } from 'react-navigation';
import AddCallsPicker from '../components/AddCallsPicker';
import FrequencyPicker from '../components/FrequencyPicker';
import RemoveCallsPicker from '../components/RemoveCallsPicker';
import { Store } from '../lib/Store';
import { Call, Person } from '../Types';

interface Props extends NavigationInjectedProps {
  store?: Store;
}

interface State {
  items: string[];
}

export default inject('store')(
  observer(
    class DetailsScreen extends Component<Props, State> {
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

      private readonly person: Person;
      private readonly log: Call[];

      constructor(props) {
        super(props);
        const name = this.props.navigation.getParam('name') as string;

        this.person = this.props.store!.people.find(
          (p) => p.contact.name === name,
        )!;

        this.log = this.props.navigation.getParam('log') as Call[];
      }

      public render() {
        return (
          <View>
            <Title>{this.person!.contact.name}</Title>
              <FrequencyPicker
                person={this.person!}
                onSelect={this.frequencyOnSelect}
              />
            <Divider />
            <AddCallsPicker person={this.person} log={this.log} />
            <Divider />
            <RemoveCallsPicker person={this.person} log={this.log} />
            {this.deleteButton(this.person!)}
          </View>
        );
      }

      private frequencyOnSelect = (index: number): void => {
        this.props.store!.setFrequency(this.person, index);
      }

      private deleteButton = (person: Person) => (
        <IconButton
          onPress={() => this.deletePerson(person)}
          size={20}
          icon='delete'
          style={{ alignSelf: 'center' }}
        />
      )

      private deletePerson = (person: Person): void => {
        this.props.store!.remove(person);
      }
    },
  ),
);
