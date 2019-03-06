import React from 'react';
import { Component } from 'react';
import {
  Button,
  StyleSheet,
  ScrollView,
  Picker,
  TouchableOpacity
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Table, Row, Rows } from 'react-native-table-component';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';

import { Frequency, FrequencyText, Person } from '../Types';
import AppLogic from '../AppLogic';
import { getLogWithPermissions } from '../CallLog';
import Contacts from '../Contacts';

let personListHeader = ['Name', 'Days\nLeft', 'Frequency', ''];

interface Props {}

interface State {
  people: Person[];
  log: Object;
}

export class HomeScreen extends Component<Props, State> {
  static navigationOptions = {
    title: 'Call Your People!'
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      people: [],
      log: undefined
    };
  }

  componentDidMount() {
    this.check();
  }

  check = () =>
    new AppLogic(details => PushNotification.localNotification(details))
      .check(getLogWithPermissions)
      .then(results => {
        this.setState({ ...results });
      });

  picker = (person: Person) => (
    <Picker
      style={{ backgroundColor: 'white' }}
      selectedValue={
        this.state.people.find(p => p.contact.name === person.contact.name)!!
          .frequency
      }
      onValueChange={(itemValue, itemIndex) => {
        this.setState(
          prevState => {
            const personIndex = prevState.people.findIndex(
              p => p.contact.name === person.contact.name
            );

            prevState.people[personIndex].frequency = itemIndex;

            return prevState;
          },
          () => this._done()
        );
      }}
    >
      {FrequencyText.map((frequencyText, index) => (
        <Picker.Item key={index} label={frequencyText} value={index} />
      ))}
    </Picker>
  );

  readonly columnWidths = [122, 55, 86, 23];

  render() {
    return (
      <ScrollView style={styles.container}>
        <Table
          borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}
          style={styles.table}
        >
          <Row
            data={personListHeader}
            style={styles.head}
            textStyle={styles.text}
            widthArr={this.columnWidths}
          />
          <Rows
            data={this._getRow()}
            textStyle={styles.text}
            widthArr={this.columnWidths}
          />
        </Table>

        <Icon.Button name="person-add" onPress={this._addPerson} style={styles.addButton}>
          Add Person
        </Icon.Button>
      </ScrollView>
    );
  }

  _getRow = () =>
    this.state.people.map(person => [
      person.contact.name,
      person.daysLeftTillCallNeeded,
      this.picker(person),
      <TouchableOpacity onPress={() => this._deletePerson(person)}>
        <Icon size={20} name="delete" />
      </TouchableOpacity>
    ]);

  _addPerson = (): void => {
    Contacts().then(selection => {
      if (!selection) {
        return null;
      }

      const newPerson = {
        contact: selection.contact,
        frequency: Frequency.once_A_Week,
        daysLeftTillCallNeeded: 0
      };

      this.setState(
        prevState => ({
          people: [...prevState.people, newPerson]
        }),
        () => this._done()
      );
    });
  };

  _done = (): void => {
    AsyncStorage.setItem('data', JSON.stringify(this.state.people));

    this.check();
  };

  _deletePerson = (person: Person): void => {
    this.setState(
      prevState => ({
        people: prevState.people.filter(
          p => p.contact.name != person.contact.name
        )
      }),
      () => this._done()
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  text: { margin: 3, textAlign: 'center' },
  table: { marginBottom: 5 },
  addButton: { alignSelf: 'center' }
});
