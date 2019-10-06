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
      notifyPeople = { person: { reminders: defaultReminder }};
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
        dtstart: convertedCompareMoment,
      });

      ruleSet.rrule(newRRule);
    });

    const next = ruleSet.all().shift()!;

    const convertedNext = new Date(
      next.getUTCFullYear(),
      next.getUTCMonth(),
      next.getUTCDate(),
      next.getUTCHours(),
      next.getUTCMinutes(),
      next.getUTCSeconds(),
    );

    return (
      Math.round(((convertedNext.getTime() -
        this.now
          .toDate()
          .getTime()) /
      1000 /
      60) // to get minutes
      + 1) // to round up to the next minute
    );
  }
}
