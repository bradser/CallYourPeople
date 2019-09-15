import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, IconButton, TextInput, Title } from 'react-native-paper';
import { Contact } from 'react-native-select-contact';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { NavigationInjectedProps } from 'react-navigation';
import AddCallsPicker from '../components/AddCallsPicker';
import DatesPicker from '../components/DatesPicker';
import DeletePersonButton from '../components/DeletePersonButton';
import FrequencyPicker from '../components/FrequencyPicker';
import { contactLink } from '../components/Link';
import RemoveCallsPicker from '../components/RemoveCallsPicker';
import { cypGreen, materialUILayout } from '../lib/Constants';
import { Store } from '../lib/Store';
import { Call, DetailsNavigationProps, Person } from '../Types';

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
          headerStyle: { backgroundColor: cypGreen },
          title: 'Details',
        };
      }

      private readonly log: Call[];
      private readonly contact: Contact;

      constructor(props) {
        super(props);

        const params = this.props.navigation.state.params!;

        this.log = params.log;

        this.contact = params.contact;
      }

      public render() {
        // May be null upon delete
        const person =
          this.contact && this.props.store!.find(this.contact.name);

        return person ? (
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity
              style={styles.name}
              onPress={this.contactLink(person)}
            >
              <Icon name='phone' size={30} style={styles.icon} />
              <Title>{person.contact.name}</Title>
            </TouchableOpacity>
            <FrequencyPicker
              person={person}
              onSelect={this.frequencyOnSelect(person)}
            />
            <TextInput
              label='Notes:'
              placeholder='Best time to call?'
              multiline={true}
              value={person.note}
              onChangeText={this.saveNote(person)}
              style={styles.divide}
            />
            <AddCallsPicker person={person} log={this.log} />
            {this.divider()}
            <RemoveCallsPicker person={person} log={this.log} />
            {this.divider()}
            <DatesPicker person={person} />
            <DeletePersonButton person={person} onPress={this.deletePerson} />
          </ScrollView>
        ) : null;
      }

      private divider = () => <Divider style={styles.divide} />;

      private contactLink = (person: Person) => (): void => {
        contactLink(person.contact.recordId);
      }

      private frequencyOnSelect = (person: Person) => (index: number): void => {
        this.props.store!.update(person, { frequency: index });
      }

      private saveNote = (person: Person) => (text: string): void => {
        this.props.store!.update(person, { note: text });
      }

      private deletePerson = (person: Person): void => {
        this.props.store!.remove(person);

        this.props.navigation.goBack();
      }
    },
  ),
);

const styles = StyleSheet.create({
  divide: {
    marginVertical: materialUILayout.rowMargin,
  },
  icon: {
    marginRight: materialUILayout.smallSpace,
  },
  name: {
    alignItems: 'center',
    flexDirection: 'row',
    height: materialUILayout.rowHeight,
    justifyContent: 'center',
  },
  notes: {
    backgroundColor: 'white',
    marginVertical: materialUILayout.rowMargin,
  },
  scrollView: { margin: materialUILayout.margin },
});
