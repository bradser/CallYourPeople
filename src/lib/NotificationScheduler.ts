import moment from 'moment';
import BackgroundFetch from 'react-native-background-fetch';
import { Sentry } from 'react-native-sentry';
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
        await this.invoke(store, log, moment());

        BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NO_DATA);
      },
      (error) => {
        Sentry.captureException(new Error(error.toString())); // TODO: see if this is an error object
      },
    );
  }

  private handleNotifications = (notifyPeople: NotifyPerson[]) => {
    const intervals = new FetchIntervalLogic(this.now!).getFetchIntervals(
      notifyPeople,
    );

    for (let i = 0; i < notifyPeople.length; i++) {
      const notifyPerson = notifyPeople[i];
      const interval = intervals[i];

      this.notifyCallback({
        largeIcon: 'ic_contact_phone',
        message:
          moment()
            .add(interval, 'm')
            .toDate()
            .toString() +
          ' : ' +
          moment()
            .add(notifyPerson.daysLeftTillCallNeeded * 24 * 60, 'm')
            .toDate()
            .toString(),
        smallIcon: 'ic_contact_phone',
        tag: notifyPerson.person.contact.recordId,
        title: `${notifyPerson.person.contact.name}`,
      });
    }

    /*notifyPeople
      .filter((notifyPerson) => notifyPerson.daysLeftTillCallNeeded <= 0)
      .forEach((notifyPerson) =>
        this.notifyCallback({
          largeIcon: 'ic_contact_phone',
          message: 'They want to hear from you!',
          smallIcon: 'ic_contact_phone',
          tag: notifyPerson.person.contact.recordId,
          title: `Call ${notifyPerson.person.contact.name} now!`,
        }),
      );*/
  }
}
