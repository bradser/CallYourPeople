import { inject, observer } from 'mobx-react';
import moment from 'moment';
import React, { Component } from 'react';
import {
  Alert,
  Dimensions,
  FlexStyle,
  StyleProp,
  StyleSheet,
  View,
} from 'react-native';
import { Button, Text } from 'react-native-paper';
import PushNotification from 'react-native-push-notification-ce';
import {
  NavigationState,
  Route,
  SceneRendererProps,
  TabBar,
  TabView,
} from 'react-native-tab-view';
import {
  NavigationEventPayload,
  NavigationEvents,
  NavigationInjectedProps,
} from 'react-navigation';
import AddPersonFAB from '../components/AddPersonFAB';
import Link from '../components/Link';
import Table from '../components/Table';
import { getLogWithPermissions } from '../lib/CallLog';
import Fremium from '../lib/Fremium';
import { fremiumCheckedLaunchContact } from '../lib/Helpers';
import NotificationScheduler from '../lib/NotificationScheduler';
import { PeopleStore } from '../lib/store/People';
import { RemindContactsStore } from '../lib/store/RemindContacts';
import { SettingsStore } from '../lib/store/Settings';
import { Call, NotifyPerson, Person } from '../Types';
import { cypGreen, materialUILayout } from './../lib/Constants';
import DevAlert from '../components/DevAlert';

interface Props extends NavigationInjectedProps {
  peopleStore?: PeopleStore;
  remindContactsStore?: RemindContactsStore;
  settingsStore?: SettingsStore;
}

interface State extends NavigationState<Route> {
  notifyPeople: NotifyPerson[];
  log: Call[];
}

export default inject('peopleStore', 'remindContactsStore', 'settingsStore')(
  observer(
    class HomeScreen extends Component<Props, State> {
      public static navigationOptions = ({ navigation }) => {
        const hiddenDevAlert = (): void => {
          DevAlert(navigation);
        };

        return {
          headerRight: <Button onPress={hiddenDevAlert} />,
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

        this.fremium = new Fremium(
          this.props.peopleStore!,
          this.props.settingsStore!,
        );

        this.props.navigation.setParams({
          settingsStore: this.props.settingsStore,
        });
      }

      public componentDidMount() {
        PushNotification.showInitialNotification((result) => {
          PushNotification.appStart();

          result
            ? fremiumCheckedLaunchContact(this.props.settingsStore!, result.tag)
            : this.runAppLogic();
        });
      }

      public render() {
        return (
          <View style={styles.containerView}>
            <NavigationEvents onDidFocus={this.handleBack} />
            <TabView
              navigationState={this.state}
              renderScene={this.renderTable}
              onIndexChange={this.setIndex}
              initialLayout={{ width: Dimensions.get('window').width }}
              renderTabBar={this.renderTabBar}
            />
            <Link
              text='Conversation Tips'
              url='https://fortheinterested.com/ask-better-questions/'
              style={this.getLinkStyle()}
            />
            {this.renderUpgradeButton()}
            <AddPersonFAB
              onPress={this.addPerson}
              navigation={this.props.navigation}
            />
          </View>
        );
      }

      private handleBack = (payload: NavigationEventPayload): void => {
        // An actual 'back', vs. other navigation.
        if (payload.action.type === 'Navigation/COMPLETE_TRANSITION') {
          this.runAppLogic();
        }
      }

      private setIndex = (index: number): void => this.setState({ index });

      private renderTable = ({ route }): React.ReactNode => {
        switch (route.key) {
          case 'callNow':
            return this.callNowTable();
          case 'callSoon':
            return this.callSoonTable();
          default:
            return null;
        }
      }

      private renderTabBar = (
        props: SceneRendererProps & {
          navigationState: NavigationState<Route>;
        },
      ): React.ReactNode => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: 'white' }}
          style={{ backgroundColor: cypGreen, color: 'black' }}
          renderLabel={this.renderTabBarLabel}
        />
      )

      private renderTabBarLabel = ({ route }): React.ReactNode => (
        <Text style={{ color: 'black' }} accessibilityHint={route.title}>
          {route.title}
        </Text>
      )

      private getLinkStyle = (): StyleProp<FlexStyle> =>
        this.props.settingsStore!.isPremium.get()
          ? styles.premiumLink
          : styles.link

      private renderUpgradeButton = (): React.ReactNode =>
        this.props.settingsStore &&
        !this.props.settingsStore.isPremium.get() && (
          <Button
            mode='contained'
            style={styles.premiumButton}
            onPress={this.fremiumUpgrade}
          >
            Upgrade to Premium
          </Button>
        )

      private initializeTabIndex = (notifiedPeople: NotifyPerson[]): void =>
        this.setIndex(
          notifiedPeople.filter((p) => p.daysLeftTillCallNeeded <= 0).length > 0
            ? 0
            : 1,
        )

      private callNowTable = (): React.ReactNode =>
        this.callTable(
          this.state.notifyPeople.filter((p) => p.daysLeftTillCallNeeded <= 0),
          'Days Since',
        )

      private callSoonTable = (): React.ReactNode =>
        this.callTable(
          this.state.notifyPeople.filter((p) => p.daysLeftTillCallNeeded > 0),
          'Days Until',
        )

      private callTable = (
        notifyPeople: NotifyPerson[],
        daysLabel: string,
      ): React.ReactNode => (
        <Table
          navigation={this.props.navigation}
          log={this.state.log}
          notifyPeople={notifyPeople}
          daysLabel={daysLabel}
        />
      )

      private runAppLogic = async (): Promise<void> => {
        const log = await getLogWithPermissions();

        const notifyPeople = await new NotificationScheduler(
          this.props.peopleStore!,
          this.props.remindContactsStore!,
          () => undefined,
        ).setReminders(moment(), log);

        this.initializeTabIndex(notifyPeople);

        this.setState({ log, notifyPeople });
      }

      private addPerson = (person: Person): void => {
        this.props.peopleStore!.add(person);

        this.runAppLogic();
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
