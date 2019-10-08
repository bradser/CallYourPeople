import moment from 'moment';
import { string } from 'prop-types';
import { NativeModules } from 'react-native';
import BackgroundFetch, {
  BackgroundFetchStatus
} from 'react-native-background-fetch';
import Sentry, { SentrySeverity } from 'react-native-sentry';
import { Call, NotifyCallback, NotifyPerson } from '../Types';
import AppLogic from './AppLogic';
import FetchIntervalLogic from './FetchIntervalLogic';
import { Store } from './Store';

export default class NotificationScheduler {
  private notifyCallback: NotifyCallback;
  private now?: moment.Moment;

  constructor(notifyCallback: NotifyCallback) {
    this.notifyCallback = notifyCallback;
  }

  public invoke = async (
    store: Store,
    log: Call[],
    now: moment.Moment,
  ): Promise<NotifyPerson[]> => {
    this.now = now;

    const notifyPeople = await new AppLogic(now).checkCallLog(
      store.people,
      log,
    );

    const minimumFetchInterval = new FetchIntervalLogic(
      now,
    ).getMinimumFetchInterval(notifyPeople);

    this.handleBackgroundConfiguration(store, log, minimumFetchInterval);

    NativeModules.Ads.getJobsIntervalMillis().then(
      (millis) => {
        /*const converted = new Map<string, number>();
        millis.forEach((value, key) => {
          converted.set(key, value / 1000 / 60);
        });*/

        Sentry.captureMessage(
          JSON.stringify(millis) + ' - ' + this.now!.toDate().toString(),
        );
      },
    );

    this.handleNotifications(notifyPeople);

    return notifyPeople;
  }

  private handleBackgroundConfiguration = (
    store: Store,
    log: Call[],
    minimumFetchInterval: number,
  ) => {
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

        await this.invoke(store, log, moment());

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

  private handleNotifications = (notifyPeople: NotifyPerson[]) => {
    notifyPeople
      .filter((notifyPerson) => notifyPerson.daysLeftTillCallNeeded <= 0)
      .forEach((notifyPerson) =>
        this.notifyCallback({
          largeIcon: 'ic_contact_phone',
          message: 'They want to hear from you!',
          smallIcon: 'ic_contact_phone',
          tag: notifyPerson.person.contact.recordId,
          title: `Call ${notifyPerson.person.contact.name} now!`,
        }),
      );
  }
}
