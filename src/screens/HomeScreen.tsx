import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import { NavigationState, Route, TabBar, TabView } from 'react-native-tab-view';
import { NavigationEvents, NavigationInjectedProps } from 'react-navigation';
import AddPersonFAB from '../components/AddPersonFAB';
import Link from '../components/Link';
import Table from '../components/Table';
import AppLogic from '../lib/AppLogic';
import { getLogWithPermissions } from '../lib/CallLog';
import { Store } from '../lib/Store';
import { Call, NotifyCallback, Person, ViewPerson } from '../Types';
import { cypGreen, materialUILayout } from './../lib/Constants';

interface Props extends NavigationInjectedProps {
  store?: Store;
}

interface State extends NavigationState<Route> {
  viewPeople: ViewPerson[];
  log: Call[];
}

export default inject('store')(
  observer(
    class HomeScreen extends Component<Props, State> {
      public static navigationOptions = {
        headerStyle: { backgroundColor: cypGreen },
        title: 'Call Your People!',
      };

      constructor(props: Props) {
        super(props);

        this.state = {
          index: 0,
          log: [],
          routes: [
            { key: 'callNow', title: 'Call Now' },
            { key: 'callSoon', title: 'Call Soon' },
          ],
          viewPeople: [],
        };
      }

      public componentDidMount() {
        // If we are being launched by a notification, don't checkAndNotify,
        // otherwise we may generate a new notification to replace
        // the one that just launched the app.
        PushNotification.showInitialNotification((result) => {
          (result ? this.check() : this.checkAndNotify()).then(
            this.initializeTabIndex,
          );

          PushNotification.appStart();
        });
      }

      public render() {
        return (
          <View style={styles.containerView}>
            <NavigationEvents onWillFocus={this.check} />
            <TabView
              navigationState={this.state}
              renderScene={this.renderScene}
              onIndexChange={this.setIndex}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={(props) => (
                <TabBar
                  {...props}
                  indicatorStyle={{ backgroundColor: 'white' }}
                  style={{ backgroundColor: cypGreen, color: 'black' }}
                  renderLabel={({ route }) => (
                    <Text style={{ color: 'black' }}>{route.title}</Text>
                  )}
                />
              )}
            />
            <Link
              text='Conversation Tips'
              url='https://fortheinterested.com/ask-better-questions/'
              style={styles.link}
            />
            <AddPersonFAB onPress={this.addPerson} />
          </View>
        );
      }

      private renderScene = ({ route }) => {
        switch (route.key) {
          case 'callNow':
            return this.callNowTable();
          case 'callSoon':
            return this.callSoonTable();
          default:
            return null;
        }
      }

      private setIndex = (index) => this.setState({ index });

      private initializeTabIndex = (state: State) =>
        this.setState({
          index:
            state.viewPeople.filter((p) => p.daysLeftTillCallNeeded <= 0).length >
            0
              ? 0
              : 1,
        })

      private callNowTable = () =>
        this.callTable(
          this.state.viewPeople.filter((p) => p.daysLeftTillCallNeeded <= 0),
          'Days Since',
        )

      private callSoonTable = () =>
        this.callTable(
          this.state.viewPeople.filter((p) => p.daysLeftTillCallNeeded > 0),
          'Days Until',
        )

      private callTable = (viewPeople, daysLabel) => (
        <Table
          navigation={this.props.navigation}
          log={this.state.log}
          viewPeople={viewPeople}
          daysLabel={daysLabel}
        />
      )

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

            return results;
          })

      private addPerson = (person: Person): void => {
        this.props.store!.add(person);

        this.checkAndNotify();
      }
    },
  ),
);

const styles = StyleSheet.create({
  containerView: { flex: 1 },
  link: {
    marginBottom: materialUILayout.margin * 2,
    marginLeft: materialUILayout.margin,
  },
});
