import moment from 'moment';
import { NativeModules } from 'react-native';
import BackgroundFetch, {
  BackgroundFetchStatus,
} from 'react-native-background-fetch';
import { Contact } from 'react-native-select-contact';
import Sentry, { SentrySeverity } from 'react-native-sentry';
import { Call, NotifyCallback, NotifyPerson } from '../Types';
import AppLogic from './AppLogic';
import { getLog } from './CallLog';
import RemindIntervalLogic from './RemindIntervalLogic';
import { PeopleStore } from './store/People';
import { RemindContactsStore } from './store/RemindContacts';

export default class NotificationScheduler {
  constructor(
    private peopleStore: PeopleStore,
    private remindContactsStore: RemindContactsStore,
    private notifyCallback: NotifyCallback,
  ) {}
  /*
    app launch:
      notify immediately
      set up reminders

    set up reminders:
      loop through people, find minimal nexts, set minimal nexts

    background launch:
      get minimal nexts -> notify
      set up reminders

    notify immediately:
      loop through people, if daystill is <= 0, notify
*/

  public notifyStoredSetReminders = async (
    now: moment.Moment,
    log: Call[],
  ): Promise<void> => {
    this.handleNotifications(this.remindContactsStore.remindContacts);

    await this.setReminders(now, log);
  }

  public setReminders = async (
    now: moment.Moment,
    log: Call[],
  ): Promise<NotifyPerson[]> => {
    const notifyPeople = await new AppLogic(now).checkCallLog(
      this.peopleStore.people,
      log,
    );

    const fetchIntervals = new RemindIntervalLogic().getRemindIntervals(
      now,
      notifyPeople,
    );

    const minimumFetchInterval = this.getMinimumFetchInterval(fetchIntervals);

    this.remindContactsStore.remindContacts = notifyPeople
      .filter(
        (notifyPerson, index) => fetchIntervals[index] === minimumFetchInterval,
      )
      .map((notifyPerson) => notifyPerson.person.contact);

    NativeModules.Ads.getJobsIntervalMillis().then((millis) => {
      Sentry.captureMessage(
        millis / 1000 / 60 +
          ' - ' +
          this.remindContactsStore.remindContacts.map((contact) => contact.name),
      );
    });

    this.handleBackgroundConfiguration(minimumFetchInterval);

    return notifyPeople;
  }

  // Pin to MAX_SAFE_INTEGER so that if the user has deleted all their contacts
  // from CYP!, we 'disable' the background task by setting the period to a large number
  // (as there is no way to cancel it)
  private getMinimumFetchInterval = (fetchIntervals: number[]): number =>
    Math.min(...fetchIntervals, Number.MAX_SAFE_INTEGER)

  private handleBackgroundConfiguration = (
    minimumFetchInterval: number,
  ): void => {
    BackgroundFetch.configure(
      {
        enableHeadless: true,
        minimumFetchInterval,
        startOnBoot: true,
        stopOnTerminate: false,
      },
      async () => {
        Sentry.captureBreadcrumb({
          category: 'Scheduling',
          level: SentrySeverity.Info,
          message: 'BackgroundFetch',
        });

        const log = await getLog();

        await this.notifyStoredSetReminders(moment(), log);

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
      },
      (status: BackgroundFetchStatus) => {
        Sentry.captureBreadcrumb({
          category: 'Scheduling',
          level: SentrySeverity.Error,
          message: 'BackgroundFetchStatus: ' + status.toString(),
        });
      },
    );
  }

  private handleNotifications = (notifyContacts: Contact[]): void => {
    notifyContacts.forEach((notifyContact) =>
      this.notifyCallback({
        largeIcon: 'ic_contact_phone',
        message: 'They want to hear from you!',
        smallIcon: 'ic_contact_phone',
        tag: notifyContact.recordId,
        title: `Call ${notifyContact.name} now!`,
      }),
    );
  }
}
