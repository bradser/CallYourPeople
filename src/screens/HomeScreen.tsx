import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { Button, Text } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import { NavigationState, Route, TabBar, TabView } from 'react-native-tab-view';
import { NavigationEvents, NavigationInjectedProps } from 'react-navigation';
import AddPersonFAB from '../components/AddPersonFAB';
import Link from '../components/Link';
import Table from '../components/Table';
import { getLogWithPermissions } from '../lib/CallLog';
import Fremium from '../lib/Fremium';
import NotificationScheduler from '../lib/NotificationScheduler';
import { Store } from '../lib/Store';
import { Call, NotifyCallback, NotifyPerson, Person } from '../Types';
import { cypGreen, materialUILayout } from './../lib/Constants';

interface Props extends NavigationInjectedProps {
  store?: Store;
}

interface State extends NavigationState<Route> {
  notifyPeople: NotifyPerson[];
  log: Call[];
}

export default inject('store')(
  observer(
    class HomeScreen extends Component<Props, State> {
      public static navigationOptions = ({ navigation }) => {
        return {
          headerRight: (
            <Button
              onPress={() => {
                let output = `Device ID: ${DeviceInfo.getUniqueID()
                  .toLocaleUpperCase()
                  .match(/.{1,3}/g)!
                  .join('-')}`;

                const userIdAmazon = (navigation.getParam('store') as Store)
                  .settings.userIdAmazon;

                if (userIdAmazon) {
                  output += `\n\nAmazon User ID: ${userIdAmazon}`;
                }

                Alert.alert('IDs', output);
              }}
            />
          ),
          headerStyle: { backgroundColor: cypGreen },
          title: 'Call Your People!',
        };
      }

      private fremium: Fremium;

      constructor(props: Props) {
        super(props);

        this.state = {
          index: 0,
          log: [],
          notifyPeople: [],
          routes: [
            {
              accessibilityLabel: 'Call these people now!',
              key: 'callNow',
              title: 'Call Now',
            },
            {
              accessibilityLabel: 'Call these people soon!',
              key: 'callSoon',
              title: 'Call Soon',
            },
          ],
        };

        this.fremium = new Fremium(this.props.store!);

        this.props.navigation.setParams({ store: this.props.store });
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
            <NavigationEvents onDidFocus={this.handleBack} />
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
                    <Text
                      style={{ color: 'black' }}
                      accessibilityHint={route.title}
                    >
                      {route.title}
                    </Text>
                  )}
                />
              )}
            />
            <Link
              text='Conversation Tips'
              url='https://fortheinterested.com/ask-better-questions/'
              style={
                this.props.store!.settings.isPremium
                  ? styles.premiumLink
                  : styles.link
              }
            />
            {this.props.store && !this.props.store!.settings.isPremium && (
              <Button
                mode='contained'
                style={styles.premiumButton}
                onPress={this.fremiumUpgrade}
              >
                Upgrade to Premium
              </Button>
            )}
            <AddPersonFAB
              onPress={this.addPerson}
              navigation={this.props.navigation}
            />
          </View>
        );
      }

      private handleBack = (event) => {
        // An actual 'back', vs. other navigation.
        if (event.action.type === 'Navigation/COMPLETE_TRANSITION') {
          this.check();
        }
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

      private initializeTabIndex = (notifiedPeople: NotifyPerson[]) =>
        this.setState({
          index:
            notifiedPeople.filter((p) => p.daysLeftTillCallNeeded <= 0).length > 0
              ? 0
              : 1,
        })

      private callNowTable = () =>
        this.callTable(
          this.state.notifyPeople.filter((p) => p.daysLeftTillCallNeeded <= 0),
          'Days Since',
        )

      private callSoonTable = () =>
        this.callTable(
          this.state.notifyPeople.filter((p) => p.daysLeftTillCallNeeded > 0),
          'Days Until',
        )

      private callTable = (notifyPeople, daysLabel) => (
        <Table
          navigation={this.props.navigation}
          log={this.state.log}
          notifyPeople={notifyPeople}
          daysLabel={daysLabel}
        />
      )

      private check = async (): Promise<NotifyPerson[]> =>
        await this.runAppLogic(() => undefined)

      private checkAndNotify = async (): Promise<NotifyPerson[]> =>
        await this.runAppLogic((details) =>
          PushNotification.localNotification(details),
        )

      private runAppLogic = async (
        notificationCallback: NotifyCallback,
      ): Promise<NotifyPerson[]> => {
        const log = await getLogWithPermissions();

        const notifyPeople = await new NotificationScheduler(
          notificationCallback,
        ).invoke(this.props.store!, log, moment());

        this.setState({ log, notifyPeople });

        return notifyPeople;
      }

      private addPerson = (person: Person): void => {
        this.props.store!.add(person);

        this.checkAndNotify();
      }

      private fremiumUpgrade = (): void => {
        this.fremium.upgrade();
      }
    },
  ),
);

const styles = StyleSheet.create({
  containerView: { flex: 1 },
  link: {
    marginBottom: materialUILayout.margin,
    marginLeft: materialUILayout.margin,
    marginTop: materialUILayout.margin,
  },
  premiumButton: {
    marginBottom: materialUILayout.smallSpace,
    marginLeft: materialUILayout.smallSpace,
    marginRight: materialUILayout.smallSpace,
  },
  premiumLink: {
    marginBottom: materialUILayout.highRowHeight,
    marginLeft: materialUILayout.margin,
    marginTop: materialUILayout.margin,
  },
});
