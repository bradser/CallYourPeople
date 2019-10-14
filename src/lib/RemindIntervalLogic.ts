import moment from 'moment';
import RRule, { RRuleSet } from 'rrule';
import { NotifyPerson } from '../Types';

export default class RemindIntervalLogic {
  public getRemindIntervals = (
    now: moment.Moment,
    previousIntervalMillis: number,
    notifyPeople: NotifyPerson[],
  ): number[] => {
    const intervals = notifyPeople.map((notifyPerson) => {
      const compareMoment = this.getCompareMoment(now.clone(), notifyPerson);

      const nextNotificationInterval = this.getNextNotificationInterval(
        now,
        previousIntervalMillis,
        notifyPerson,
        compareMoment,
      );

      return nextNotificationInterval;
    });

    return intervals;
  }

  private getCompareMoment = (now: moment.Moment, notifyPerson: NotifyPerson) =>
    notifyPerson.daysLeftTillCallNeeded > 0
      ? now.add(notifyPerson.daysLeftTillCallNeeded * 24 * 60 * 60, 's')
      : now

  private getNextNotificationInterval = (
    now: moment.Moment,
    previousIntervalMillis: number,
    notifyPerson: NotifyPerson,
    compareMoment: moment.Moment,
  ): number => {
    // Conversion due to https://github.com/jakubroztocil/rrule#important-use-utc-dates
    const convertedCompareMoment = compareMoment
      .add(now.utcOffset(), 'minutes')
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

    const nextInterval = this.getNextIntervalFromDates(
      now,
      previousIntervalMillis,
      nextDates,
    );

    return nextInterval;
  }

  private getNextIntervalFromDates = (
    now: moment.Moment,
    previousIntervalMillis: number,
    nextDates: Date[],
  ): number => {
    let nextInterval = this.getIntervalFromDate(now, nextDates[0]);

    const fivePercentMinutes =
      Math.ceil(previousIntervalMillis / 1000 / 60 / 20) + 1;

    // If we are within 5% of the interval, interval is too short, so skip to the next interval.
    // 5% of the specified interval is the flex time that the JobScheduler uses.
    if (nextInterval <= fivePercentMinutes) {
      nextInterval = this.getIntervalFromDate(now, nextDates[1]);
    }

    return nextInterval;
  }

  private getIntervalFromDate = (
    now: moment.Moment,
    nextDate: Date,
  ): number => {
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
      (convertedNext.getTime() - now.toDate().getTime()) / 1000 / 60, // to get minutes
    );
  }
}
