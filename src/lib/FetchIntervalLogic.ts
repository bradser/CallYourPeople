import moment from 'moment';
import RRule, { RRuleSet } from 'rrule';
import { NotifyPerson } from '../Types';

export default class FetchIntervalLogic {
  private now: moment.Moment;

  constructor(now: moment.Moment) {
    this.now = now;
  }

  public getMinimumFetchInterval = (notifyPeople: NotifyPerson[]) => {
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
    let reminders = notifyPerson.person.reminders;

    if (!reminders || reminders.length === 0) {
      reminders = [
        new RRule({
          byhour: [7, 18],
          byminute: [0],
          bysecond: [0],
          count: 1,
          freq: RRule.DAILY,
          interval: 1,
        }),
      ];
    }

    const ruleSet = new RRuleSet();

    // Conversion due to https://github.com/jakubroztocil/rrule#important-use-utc-dates
    const convertedCompareMomemnt = compareMoment.add(
      this.now.utcOffset(),
      'minutes',
    ).toDate();

    reminders.forEach((rrule) => {
      // @ts-ignore: Update dtstart only
      rrule.options.dtstart = convertedCompareMomemnt;

      ruleSet.rrule(rrule);
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
      (convertedNext.getTime() -
        this.now
          .clone()
          .toDate()
          .getTime()) /
      1000 /
      60
    ); // to get minutes
  }
}
