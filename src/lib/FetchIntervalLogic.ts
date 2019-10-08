import moment from 'moment';
import RRule, { RRuleSet } from 'rrule';
import { NotifyPerson } from '../Types';
import { defaultReminder } from './Constants';

export default class FetchIntervalLogic {
  private now: moment.Moment;

  constructor(now: moment.Moment) {
    this.now = now;
  }

  public getMinimumFetchInterval = (notifyPeople: NotifyPerson[]): number => {
    if (notifyPeople.length === 0) {
      // @ts-ignore ignore rest of notifyPeople properties
      notifyPeople.push({ person: { reminders: defaultReminder } });
    }

    const intervals = this.getFetchIntervals(notifyPeople);

    return Math.min(...intervals);
  }

  public getFetchIntervals = (notifyPeople: NotifyPerson[]): number[] => {
    const intervals = notifyPeople.map((notifyPerson) => {
      const compareTime = this.getCompareTime(notifyPerson);

      const nextNotificationInterval = this.getNextNotificationInterval(
        notifyPerson,
        compareTime,
      );

      return nextNotificationInterval;
    });

    return intervals;
  }

  private getCompareTime(notifyPerson: NotifyPerson) {
    const now = this.now.clone();

    return notifyPerson.daysLeftTillCallNeeded > 0
      ? now.add(notifyPerson.daysLeftTillCallNeeded * 24 * 60 * 60, 's')
      : now;
  }

  private getNextNotificationInterval = (
    notifyPerson: NotifyPerson,
    compareMoment: moment.Moment,
  ): number => {
    // Conversion due to https://github.com/jakubroztocil/rrule#important-use-utc-dates
    const convertedCompareMoment = compareMoment
      .add(this.now.utcOffset(), 'minutes')
      .toDate();

    const ruleSet = new RRuleSet();
    notifyPerson.person.reminders.forEach((rrule) => {
      const newRRule = new RRule({
        ...rrule.options,
        count: 2, // TODO: remove eventually
        dtstart: convertedCompareMoment,
      });

      ruleSet.rrule(newRRule);
    });

    const nextDates = ruleSet.all();

    const nextInterval = this.getNextIntervalFromDates(nextDates);

    return nextInterval;
  }

  private getNextIntervalFromDates = (nextDates: Date[]): number => {
    let nextInterval = this.getIntervalFromDate(nextDates[0]);

    // If we are within 5% of the 12 hours (36) minutes, interval is too short, so skip to the next interval.
    // 5% of the specified period is the flex time that the JobScheduler uses.
    if (nextInterval <= 40) {
      nextInterval = this.getIntervalFromDate(nextDates[1]);
    }

    return nextInterval;
  }

  private getIntervalFromDate = (nextDate: Date): number => {
    // Conversion due to https://github.com/jakubroztocil/rrule#important-use-utc-dates
    const convertedNext = new Date(
      nextDate.getUTCFullYear(),
      nextDate.getUTCMonth(),
      nextDate.getUTCDate(),
      nextDate.getUTCHours(),
      nextDate.getUTCMinutes(),
      nextDate.getUTCSeconds(),
    );

    return Math.ceil(
      (convertedNext.getTime() - this.now.toDate().getTime()) / 1000 / 60, // to get minutes
    );
  }
}
