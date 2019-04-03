import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { IconButton } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import { Cell, Row, Table, TableWrapper } from 'react-native-table-component';
import AppLogic from '../AppLogic';
import { getLogWithPermissions } from '../CallLog';
import AddPersonButton from '../components/AddPersonButton';
import FrequencyPicker from '../components/FrequencyPicker';
import Link from '../components/Link';
import TouchableOpacityButton from '../components/TouchableOpacityButton';
import { NotifyCallback, Person } from '../Types';

// tslint:disable-next-line: no-empty-interface
interface Props {}

interface State {
  people: Person[];
  log: any | undefined;
}

export default class HomeScreen extends Component<Props, State> {
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
    // If we are being launched by a notification, don't checkAndNotify,
    // otherwise we may generate a new notification to replace
    // the one that just launched the app.
    PushNotification.showInitialNotification((result) => {
      if (result) {
        this.check();
      } else {
        this.checkAndNotify();
      }

      PushNotification.appStart();
    });
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
        <AddPersonButton onPress={this.addPerson} />
        <Link
          text='Conversation Tips'
          url='https://fortheinterested.com/ask-better-questions/'
        />
      </ScrollView>
    );
  }

  private check = () => this.runAppLogic(() => undefined);

  private checkAndNotify = () =>
    this.runAppLogic((details) => PushNotification.localNotification(details))

  private runAppLogic = (notificationCallback: NotifyCallback) =>
    new AppLogic(notificationCallback, moment())
      .check(getLogWithPermissions)
      .then((results) => {
        this.setState(results);
      })

  private getRows = () =>
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

  private frequencyOnSelect = (person, index) => {
    this.setState(
      (prevState) => {
        const newPeople = this.setFrequency(prevState.people, person, index);

        return { ...prevState, people: newPeople };
      },
      () => this.saveAndRecheck(),
    );
  }

  private setFrequency = (people, person, frequency): Person[] => {
    const personIndex = people.findIndex(
      (p) => p.contact.name === person.contact.name,
    );

    people[personIndex].frequency = frequency;

    return people;
  }

  private callLauncher = (
    person: Person,
    contentCallback: (person: Person) => string,
  ) => (
    <TouchableOpacityButton
      onPress={() => this.props.navigation.navigate('Details')}
      text={contentCallback(person)}
    />
  )

  private deleteButton = (person: Person) => (
    <IconButton
      onPress={() => this.deletePerson(person)}
      size={20}
      icon='delete'
      style={{alignSelf: 'center'}}
    />
  )

  private addPerson = (person: Person): void => {
    // TODO: overwrite duplicate person
    this.setState(
      (prevState) => ({
        people: [...prevState.people, person],
      }),
      () => this.saveAndRecheck(),
    );
  }

  private saveAndRecheck = (): void => {
    AsyncStorage.setItem('data', JSON.stringify(this.state.people));

    this.checkAndNotify();
  }

  private deletePerson = (person: Person): void => {
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
