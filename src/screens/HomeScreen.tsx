import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { DataTable } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import { NavigationInjectedProps } from 'react-navigation';
import AddPersonButton from '../components/AddPersonButton';
import Link from '../components/Link';
import AppLogic from '../lib/AppLogic';
import { getLogWithPermissions } from '../lib/CallLog';
import { Store } from '../lib/Store';
import {
  DetailsNavigationProps,
  FrequencyText,
  NotifyCallback,
  Person,
  ViewPerson,
} from '../Types';
import { CYMGreen } from './../lib/Constants';

interface Props extends NavigationInjectedProps {
  store?: Store;
}

interface State {
  viewPeople?: ViewPerson[];
  log?: any;
}

export default inject('store')(
  observer(
    class HomeScreen extends Component<Props, State> {
      public static navigationOptions = {
        title: 'Call Your People!',
      };

      constructor(props: Props) {
        super(props);

        this.state = {
          log: [],
          viewPeople: [],
        };
      }

      public componentDidMount() {
        // If we are being launched by a notification, don't checkAndNotify,
        // otherwise we may generate a new notification to replace
        // the one that just launched the app.
        PushNotification.showInitialNotification((result) => {
          result ? this.check() : this.checkAndNotify();

          PushNotification.appStart();
        });
      }

      public render() {
        return (
          <View style={styles.containerView}>
            <ScrollView style={styles.scrollView}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Name</DataTable.Title>
                  <DataTable.Title numeric>Days Left</DataTable.Title>
                  <DataTable.Title numeric>Frequency</DataTable.Title>
                </DataTable.Header>
                {this.getRows()}
              </DataTable>
            </ScrollView>
            <Link
              text='Conversation Tips'
              url='https://fortheinterested.com/ask-better-questions/'
            />
            <AddPersonButton onPress={this.addPerson} />
          </View>
        );
      }

      private check = () => this.runAppLogic(() => undefined);

      private checkAndNotify = () =>
        this.runAppLogic((details) =>
          PushNotification.localNotification(details),
        )

      private runAppLogic = (notificationCallback: NotifyCallback) =>
        new AppLogic(notificationCallback, moment())
          .check(getLogWithPermissions, this.props.store!)
          .then((results) => {
            this.setState(results);
          })

      private getRows = () =>
        this.state.viewPeople!.map((person, index) => {
          const daysLeftBackgoundColor =
            person.daysLeftTillCallNeeded <= 0
              ? { ...styles.cell, backgroundColor: CYMGreen }
              : styles.cell;

          return (
            <DataTable.Row
              key={index}
              onPress={() =>
                this.props.navigation.navigate('Details', {
                  log: this.state.log,
                  name: person.name,
                })
              }
            >
              <DataTable.Cell>{person.name}</DataTable.Cell>
              <DataTable.Cell numeric style={daysLeftBackgoundColor}>
                {person.daysLeftTillCallNeeded.toString()}
              </DataTable.Cell>
              <DataTable.Cell numeric>
                {FrequencyText[person.frequency]}
              </DataTable.Cell>
            </DataTable.Row>
          );
        })

      private addPerson = (person: Person): void => {
        this.props.store!.add(person);

        this.checkAndNotify();
      }
    },
  ),
);

const styles = StyleSheet.create({
  cell: { paddingRight: 5 },
  containerView: { flex: 1 },
  scrollView: { padding: 10 },
});
