import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { PureComponent } from 'react';
import {
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import PushNotification from 'react-native-push-notification-ce';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import * as MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AppLogic from '../AppLogic';
import { getLogWithPermissions } from '../CallLog';
import FrequencyPicker from '../components/FrequencyPicker';
import Contacts from '../Contacts';
import { Frequency, Person } from '../Types';

// tslint:disable-next-line: no-empty-interface
interface Props {}

interface State {
  people: Person[];
  log: any | undefined;
}

export class HomeScreen extends PureComponent<Props, State> {
  public static navigationOptions = {
    title: 'Call Your People!',
  };

  public readonly columnFlexes = [1, 0.35, 0.7, 0.17];
  public readonly personListHeader = ['Name', 'Days\nLeft', 'Frequency', ''];

  constructor(props: Props) {
    super(props);

    this.state = {
      log: [],
      people: [],
    };
  }

  public componentDidMount() {
    this.check();
  }

  public render() {
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
          name='person-add'
          onPress={this.addPerson}
          style={styles.addButton}
        >
          Add Person
        </MaterialIcon.Button>
      </ScrollView>
    );
  }

  public check = () =>
    new AppLogic(
      (details) => PushNotification.localNotification(details),
      moment(),
    )
      .check(getLogWithPermissions)
      .then((results) => {
        this.setState({ ...results });
      })

  public getRows = () =>
    this.state.people.map((person, personIndex) => {
      const daysLeftBackgoundColor =
        person.daysLeftTillCallNeeded <= 0
          ? { backgroundColor: 'lawngreen' }
          : {};

      return (
        <TableWrapper key={personIndex} style={{ flexDirection: 'row' }}>
          <Cell
            key={1}
            data={this.callLauncher(person, (p) => p.contact.name)}
            flex={this.columnFlexes[0]}
          />
          <Cell
            key={2}
            data={this.callLauncher(person, (p) =>
              p.daysLeftTillCallNeeded.toString(),
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
    })

  public frequencyOnSelect = (person, index) => {
    this.setState(
      (prevState) => {
        this.setFrequency(prevState.people, person, index);

        return prevState;
      },
      () => this.saveAndRecheck(),
    );
  }

  public setFrequency = (people, person, frequency): void => {
    const personIndex = people.findIndex(
      (p) => p.contact.name === person.contact.name,
    );

    people[personIndex].frequency = frequency;
  }

  public callLauncher = (
    person: Person,
    contentCallback: (person: Person) => string,
  ) => (
    <TouchableOpacity
      onPress={() =>
        Linking.openURL(
          `content://com.android.contacts/contacts/${
            person.contact.recordId
          }`,
        )
      }
    >
      <Text style={styles.cell}>{contentCallback(person)}</Text>
    </TouchableOpacity>
  )

  public deleteButton = (person) => (
    <TouchableOpacity
      onPress={() => this.deletePerson(person)}
      style={styles.cell}
    >
      <MaterialIcon.default size={20} name='delete' />
    </TouchableOpacity>
  )

  public addPerson = (): void => {
    Contacts().then((selection) => {
      if (!selection) {
        return;
      }

      const newPerson = new Person(selection.contact, Frequency.once_A_Week, 0);

      this.setState(
        (prevState) => ({
          people: [...prevState.people, newPerson],
        }),
        () => this.saveAndRecheck(),
      );
    });
  }

  public saveAndRecheck = (): void => {
    AsyncStorage.setItem('data', JSON.stringify(this.state.people));

    this.check();
  }

  public deletePerson = (person: Person): void => {
    this.setState(
      (prevState) => ({
        people: prevState.people.filter(
          (p) => p.contact.name !== person.contact.name,
        ),
      }),
      () => this.saveAndRecheck(),
    );
  }
}

const styles = StyleSheet.create({
  addButton: { alignSelf: 'center' },
  cell: { margin: 2, textAlign: 'center' },
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: '#fff' },
  head: { height: 40, backgroundColor: '#f1f8ff' },
  table: { marginBottom: 5 },
});
