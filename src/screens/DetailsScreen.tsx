import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, IconButton, Title } from 'react-native-paper';
import { NavigationInjectedProps, NavigationScreenProps } from 'react-navigation';
import AddCallsPicker from '../components/AddCallsPicker';
import DeletePersonButton from '../components/DeletePersonButton';
import FrequencyPicker from '../components/FrequencyPicker';
import RemoveCallsPicker from '../components/RemoveCallsPicker';
import { cymGreen, materialUILayout } from '../lib/Constants';
import { Store } from '../lib/Store';
import { Call, Person, DetailsNavigationProps } from '../Types';

interface Props extends NavigationInjectedProps<DetailsNavigationProps> {
  store?: Store;
}

export default inject('store')(
  observer(
    class DetailsScreen extends Component<Props> {
      public static navigationOptions = ({ navigation }) => {
        return {
          headerLeft: (
            <IconButton
              onPress={() => navigation.goBack()}
              icon='arrow-back'
              size={20}
            />
          ),
          headerStyle: { backgroundColor: cymGreen },
          title: 'Details',
        };
      }

      private readonly log: Call[];
      private readonly name: string;

      constructor(props) {
        super(props);

        this.log = this.props.navigation.state.params!.log;

        this.name = this.props.navigation.state.params!.name;
      }

      public render() {
        // May be null upon delete
        const person = this.props.store!.find(this.name);

        return person ? (
          <ScrollView style={styles.scrollView}>
            <Title style={styles.name}>{person.contact.name}</Title>
            <FrequencyPicker
              person={person}
              onSelect={this.frequencyOnSelect(person)}
            />
            <Divider style={styles.divider} />
            <AddCallsPicker person={person} log={this.log} />
            <Divider style={styles.divider} />
            <RemoveCallsPicker person={person} log={this.log} />
            <Divider style={styles.divider} />
            <DeletePersonButton person={person} onPress={this.deletePerson} />
          </ScrollView>
        ) : null;
      }

      private frequencyOnSelect = (person: Person) => (index: number): void => {
        this.props.store!.update(person, { frequency: index });
      }

      private deletePerson = (person: Person): void => {
        this.props.store!.remove(person);

        this.props.navigation.goBack();
      }
    },
  ),
);

const styles = StyleSheet.create({
  divider: {
    marginVertical: materialUILayout.rowMargin,
  },
  name: { height: materialUILayout.rowHeight },
  scrollView: { margin: materialUILayout.margin },
});
