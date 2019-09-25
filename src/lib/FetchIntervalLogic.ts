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
      const now = this.now.clone()

      const compareTime =
        notifyPerson.daysLeftTillCallNeeded > 0
          ? now.add(notifyPerson.daysLeftTillCallNeeded * 24 * 60 * 60, 's')
          : now;

      const nextNotificationInterval = this.getNextNotificationInterval(
        notifyPerson,
        compareTime,
      );

      return nextNotificationInterval;
    });

    return intervals;
  }

  private getNextNotificationInterval = (
    notifyPerson: NotifyPerson,
    compareMoment: moment.Moment,
  ): number => {
    let reminders = notifyPerson.person.reminders;

    // Conversion due to https://github.com/jakubroztocil/rrule#important-use-utc-dates
    const convertedCompareMomemnt = compareMoment.add(this.now.utcOffset(), 'minutes');

    if (!reminders || reminders.count() === 0) {
      reminders = new RRuleSet();

      reminders.rrule(
        new RRule({
          byhour: [7, 18],
          byminute: [0],
          bysecond: [0],
          count: 1,
          dtstart: convertedCompareMomemnt.toDate(),
          freq: RRule.DAILY,
          interval: 1,
        }),
      );
    }

    const next = reminders.all().shift()!;

    const convertedNext = new Date(next.getUTCFullYear(), next.getUTCMonth(), next.getUTCDate(),
    next.getUTCHours(), next.getUTCMinutes(), next.getUTCSeconds());

    return (
      convertedNext.getTime() -
      this.now
        .clone()
        .toDate()
        .getTime()
    ) / 1000 / 60; // to get minutes
  }
}
