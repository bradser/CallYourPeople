import moment from 'moment';
import { getTimeZone } from 'react-native-localize';
import RRule, { RRuleSet } from 'rrule';
import { NotifyPerson } from '../Types';
import { Alert } from 'react-native';

export default class FetchIntervalLogic {
  private now: moment.Moment;

  constructor(now: moment.Moment) {
    this.now = now;
  }

  public getMinimumFetchInterval = (notifyPeople: NotifyPerson[]) => {
    const intervals = this.getFetchIntervals(notifyPeople);

    return Math.min(...intervals, 60 * 12); // TODO: maybe add on some buffer?
  }

  public getFetchIntervals = (notifyPeople: NotifyPerson[]): number[] => {
    const intervals = notifyPeople.map((notifyPerson) => {
      const compareTime =
        notifyPerson.daysLeftTillCallNeeded > 0
          ? this.now.clone().add(notifyPerson.daysLeftTillCallNeeded, 'd')
          : this.now.clone();

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

    if (!reminders || reminders.count() === 0) {
      reminders = new RRuleSet();

      reminders.rrule(
        new RRule({
          byhour: [7, 18],
          byminute: [0],
          bysecond: [0],
          byweekday: [
            RRule.MO,
            RRule.TU,
            RRule.WE,
            RRule.TH,
            RRule.FR,
            RRule.SA,
            RRule.SU,
          ],
          freq: RRule.DAILY,
          interval: 1,
          tzid: getTimeZone(),
        }),
      );
    }

    const next = reminders.after(compareMoment.utc().toDate(), true);

    return (
      next.getTime() -
      this.now
        .clone()
        .toDate()
        .getTime()
    );
  }
}
