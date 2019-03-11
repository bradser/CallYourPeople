import React from 'react';
import { PureComponent } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import * as MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PushNotification from 'react-native-push-notification';
import { Frequency, Person } from '../Types';
import AppLogic from '../AppLogic';
import { getLogWithPermissions } from '../CallLog';
import Contacts from '../Contacts';
import FrequencyPicker from '../components/FrequencyPicker';

interface Props {}

interface State {
  people: Person[];
  log: Object;
}

export class HomeScreen extends PureComponent<Props, State> {
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

  readonly columnFlexes = [1, 0.3, 0.55, 0.14];
  readonly personListHeader = ['Name', 'Days\nLeft', 'Frequency', ''];

  render() {
    return (
      <ScrollView style={styles.container}>
        <Table
          borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}
          style={styles.table}
        >
          <Row
            data={this.personListHeader}
            style={styles.head}
            textStyle={styles.cell}
            flexArr={this.columnFlexes}
          />
          {this.getRows()}
        </Table>
        <MaterialIcon.Button
          name="person-add"
          onPress={this.addPerson}
          style={styles.addButton}
        >
          Add Person
        </MaterialIcon.Button>
      </ScrollView>
    );
  }

  check = () =>
    new AppLogic(
      details => PushNotification.localNotification(details),
      moment()
    )
      .check(getLogWithPermissions)
      .then(results => {
        this.setState({ ...results });
      });

  getRows = () =>
    this.state.people.map((person, personIndex) => {
      const daysLeftBackgoundColor =
        person.daysLeftTillCallNeeded <= 0
          ? { backgroundColor: 'lawngreen' }
          : {};

      return (
        <TableWrapper key={personIndex} style={{ flexDirection: 'row' }}>
          <Cell
            key={1}
            data={this.callLauncher(person, person => person.contact.name)}
            flex={this.columnFlexes[0]}
          />
          <Cell
            key={2}
            data={this.callLauncher(
              person,
              person => person.daysLeftTillCallNeeded
            )}
            flex={this.columnFlexes[1]}
            style={daysLeftBackgoundColor}
          />
          <Cell
            key={3}
            data={
              <FrequencyPicker
                person={person}
                onSelect={this.frequencyOnSelect}
                styles={styles.cell}
              />
            }
            flex={this.columnFlexes[2]}
          />
          <Cell
            key={4}
            data={this.deleteButton(person)}
            flex={this.columnFlexes[3]}
          />
        </TableWrapper>
      );
    });

  frequencyOnSelect = (person, index) => {
    this.setState(
      prevState => {
        this.setFrequency(prevState.people, person, index);

        return prevState;
      },
      () => this.saveAndRecheck()
    );
  };

  setFrequency = (people, person, frequency): void => {
    const personIndex = people.findIndex(
      p => p.contact.name === person.contact.name
    );

    people[personIndex].frequency = frequency;
  };

  callLauncher = (person: Person, contentCallback) => (
    <TouchableOpacity
      onPress={() => Linking.openURL(`tel:${person.contact.phones[0].number}`)}
    >
      <Text style={styles.cell}>{contentCallback(person)}</Text>
    </TouchableOpacity>
  );

  deleteButton = person => (
    <TouchableOpacity
      onPress={() => this.deletePerson(person)}
      style={styles.cell}
    >
      <MaterialIcon.default size={20} name="delete" />
    </TouchableOpacity>
  );

  addPerson = (): void => {
    Contacts().then(selection => {
      if (!selection) {
        return;
      }

      const newPerson = new Person(selection.contact, Frequency.once_A_Week, 0);

      this.setState(
        prevState => ({
          people: [...prevState.people, newPerson]
        }),
        () => this.saveAndRecheck()
      );
    });
  };

  saveAndRecheck = (): void => {
    AsyncStorage.setItem('data', JSON.stringify(this.state.people));

    this.check();
  };

  deletePerson = (person: Person): void => {
    this.setState(
      prevState => ({
        people: prevState.people.filter(
          p => p.contact.name != person.contact.name
        )
      }),
      () => this.saveAndRecheck()
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  cell: { margin: 3, textAlign: 'center' },
  table: { marginBottom: 5 },
  addButton: { alignSelf: 'center' }
});
