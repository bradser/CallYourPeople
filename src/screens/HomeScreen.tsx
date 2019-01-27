import React from "react";
import { Component } from "react";
import {
  AsyncStorage,
  Button,
  StyleSheet,
  ScrollView,
  Picker
} from "react-native";
import { Table, Row, Rows } from "react-native-table-component";
import { NotificationsAndroid } from "react-native-notifications";

import { Frequency, FrequencyText, Person } from "../Types";
import AppLogic from "../AppLogic";
import Contacts from "../Contacts";

let personListHeader = ["Name", "Days Remaining", "Frequency", "Delete"];

interface Props {}

interface State {
  people: Person[];
  log: Object;
}

export class HomeScreen extends Component<Props, State> {
  static navigationOptions = {
    title: "Call Your People!"
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      people: [],
      log: undefined
    };
  }

  componentDidMount() {
    new AppLogic(NotificationsAndroid.localNotification)
      .check()
      .then(results => {
        this.setState({ ...results });
      });
  }

  picker = index => (
    <Picker
      selectedValue={index}
      onValueChange={(itemValue, itemIndex) =>
        /*this.setState(prevState => {
          prevState.text[prevState.index] = itemValue;
          return prevState;
        })*/
        {}
      }
    >
      {FrequencyText.map((frequencyText, index) => (
        <Picker.Item key={index} label={frequencyText} value={index} />
      ))}
    </Picker>
  );

  render() {
    return (
      <ScrollView style={styles.container}>
        <Table borderStyle={{ borderWidth: 2, borderColor: "#c8e1ff" }}>
          <Row
            data={personListHeader}
            style={styles.head}
            textStyle={styles.text}
          />
          <Rows data={this._getDisplayPeople()} textStyle={styles.text} />
        </Table>

        <Button title="Add" onPress={this._addPerson} />
      </ScrollView>
    );
  }

  _getDisplayPeople = () =>
     this.state.people.map(person => 
      [
      person.contact.name,
      person.daysLeftTillCallNeeded,
      this.picker(person.frequency),
      <Button title="Delete" onPress={() => this._deletePerson(person)} />
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

      const newPeople = this.state.people;
      newPeople.push(newPerson);

      this.setState(
        () => ({
          people: newPeople
        }),
        () => this._done()
      );
    });
  };

  _done = (): void => {
    AsyncStorage.setItem("data", JSON.stringify(this.state.people));
  };

  _deletePerson = (person: Person): void => {
    this.setState(
      () => ({
        people: this.state.people.filter(p => p.contact.name != person.contact.name)
      }),
      () => this._done()
    );
  };
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "#f1f8ff" },
  text: { margin: 6, textAlign: "center" },
  btn: { width: 58, height: 18, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});

const addPersonStyles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 30, backgroundColor: "#fff" },
  head: { height: 40, backgroundColor: "orange" },
  text: { margin: 6, textAlign: "center", color: "black" },
  row: { flexDirection: "row", backgroundColor: "#FFF1C1" },
  btn: { width: 58, height: 40, backgroundColor: "#78B7BB", borderRadius: 2 },
  btnText: { textAlign: "center", color: "#fff" }
});
