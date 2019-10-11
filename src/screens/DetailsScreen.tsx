import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Divider, IconButton, TextInput, Title } from 'react-native-paper';
import { Contact } from 'react-native-select-contact';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { NavigationInjectedProps } from 'react-navigation';
import AddCallsPicker from '../components/AddCallsPicker';
import CypMenu from '../components/CypMenu';
import DatesPicker from '../components/DatesPicker';
import DeletePersonButton from '../components/DeletePersonButton';
import RemindersPicker from '../components/RemindersPicker';
import RemoveCallsPicker from '../components/RemoveCallsPicker';
import { cypGreen, materialUILayout } from '../lib/Constants';
import { fremiumCheckedLaunchContact } from '../lib/Helpers';
import { PeopleStore } from '../lib/store/People';
import { SettingsStore } from '../lib/store/Settings';
import { Call, DetailsNavigationProps, FREQUENCY_MAP, Person } from '../Types';

interface Props extends NavigationInjectedProps<DetailsNavigationProps> {
  peopleStore?: PeopleStore;
  settingsStore?: SettingsStore;
}

export default inject('peopleStore', 'settingsStore')(
  observer(
    class DetailsScreen extends Component<Props> {
      public static navigationOptions = ({ navigation }) => {
        const goBack = (): void => {
          navigation.goBack();
        };

        return {
          headerLeft: (
            <IconButton onPress={goBack} icon='arrow-left' size={20} />
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
          this.contact && this.props.peopleStore!.find(this.contact.name);

        return person ? (
          <ScrollView style={styles.scrollView}>
            <TouchableOpacity
              style={styles.name}
              onPress={this.launchContact(person)}
            >
              <Icon name='phone' size={30} style={styles.icon} />
              <Title>{person.contact.name}</Title>
            </TouchableOpacity>
            <CypMenu
              title={'Frequency:'}
              labels={Array.from(FREQUENCY_MAP).map((value) => value[1].text)}
              selectedIndex={person.frequency.valueOf()}
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
            {this.divider()}
            <RemindersPicker person={person} />
            <DeletePersonButton person={person} onPress={this.deletePerson} />
          </ScrollView>
        ) : null;
      }

      private divider = () => <Divider style={styles.divide} />;

      private launchContact = (person: Person) => (): void => {
        fremiumCheckedLaunchContact(
          this.props.settingsStore!,
          person.contact.recordId,
        );
      }

      private frequencyOnSelect = (person: Person) => (index: number): void => {
        this.props.peopleStore!.update(person, { frequency: index });
      }

      private saveNote = (person: Person) => (text: string): void => {
        this.props.peopleStore!.update(person, { note: text });
      }

      private deletePerson = (person: Person): void => {
        this.props.peopleStore!.remove(person);

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
  scrollView: {
    margin: materialUILayout.margin,
    padding: materialUILayout.smallSpace,
  },
});
