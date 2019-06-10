import moment from 'moment';
import { PhoneEntry } from 'react-native-select-contact';
import { Sentry } from 'react-native-sentry';
import {
  Call,
  CallType,
  CheckOutput,
  Found,
  Frequency,
  GetLogCallback,
  NotifyCallback,
  Person,
  ViewPerson,
} from '../Types';
import { Store } from './Store';

export default class AppLogic {
  constructor(
    private notifyCallback: NotifyCallback,
    private rightNow: moment.Moment,
  ) {}

  public check = async (
    getLog: GetLogCallback,
    store: Store,
  ): Promise<CheckOutput> => {
    try {
      const log: Call[] = await getLog();

      const viewPeople = this.checkCallLog(store.people, log);

      return new CheckOutput(viewPeople, log);
    } catch (error) {
      Sentry.captureException(error);

      return new CheckOutput([], []);
    }
  }

  public checkCallLog = (people: Person[], callLog: Call[]): ViewPerson[] =>
    people
      .map((person: Person) => {
        const procesedLog = this.processModifiedCalls(person, callLog);

        const found = this.findPhoneAndCall(person, procesedLog);

        // If there was never a call to/from this person, notify immediately
        const days = found.call
          ? this.roundDaysLeftTillCallNeeded(person, found.call)
          : 0;

        if (days <= 0) {
          this.notify(person);
        }

        return new ViewPerson(person.contact, person.frequency, days);
      })
      .sort(this.sortByDaysThenName)

  public processModifiedCalls = (person: Person, callLog: Call[]): Call[] => {
    const removed =
      person.removed.length > 0
        ? callLog.filter(
            (call) =>
              !person.removed.find(
                (r) =>
                  r.timestamp === call.timestamp &&
                  r.phoneNumber === call.phoneNumber,
              ),
          )
        : callLog;

    const added =
      person.added.length > 0
        ? person.added.map((call) => ({
            ...call,
            phoneNumber: person.contact.phones[0].number,
          }))
        : removed;

    return removed
      .concat(added)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }

  private sortByDaysThenName = (a: ViewPerson, b: ViewPerson): number =>
    a.daysLeftTillCallNeeded === b.daysLeftTillCallNeeded
      ? a.name <= b.name
        ? -1
        : 1
      : a.daysLeftTillCallNeeded <= b.daysLeftTillCallNeeded
      ? -1
      : 1

  private findPhoneAndCall = (person: Person, callLog: Call[]): Found => {
    let phone: PhoneEntry | undefined;

    const call = callLog.find((c) => {
      phone = person.contact.phones.find((p) => c.phoneNumber === p.number);

      return Boolean(phone);
    });

    // If there was never a call to this person, default to the first phone found
    return new Found(
      phone || (person.contact.phones && person.contact.phones[0]),
      call,
    );
  }

  private daysLeftTillCallNeeded = (person: Person, call: Call): number => {
    const daysSince = this.callDateToDaysSinceLastCall(call.timestamp);

    if (call.type === CallType.MISSED) {
      return -daysSince;
    }

    if (this.isVoicemail(call)) {
      if (call.type === CallType.INCOMING) {
        return -daysSince;
      }

      if (call.type === CallType.OUTGOING) {
        // Leave a voicemail every other day, or complete a conversation
        // TODO: a user setting?
        // TODO: only if the next call is outside of the frequency?
        return 2 - daysSince;
      }

      Sentry.captureException(
        new Error(
          `unexpected CallType ${call.type} in checkCall's isVoicemail check`,
        ),
      );

      return 0;
    }

    const frequencyDays = this.frequencyToDays(person);

    return frequencyDays - daysSince;
  }

  private roundDaysLeftTillCallNeeded = (person: Person, call: Call): number =>
    this.roundDays(this.daysLeftTillCallNeeded(person, call))

  // TODO: a user setting?
  private isVoicemail = (call: Call): boolean => call.duration <= 2 * 60;

  private callDateToDaysSinceLastCall = (timestamp: string): number =>
    Math.abs(this.rightNow.diff(new Date(parseInt(timestamp, 10)), 'minutes')) /
    (60 * 24)

  private roundDays = (days: number): number => Math.round(days * 10) / 10;

  private frequencyToDays = ({ frequency }): number => {
    switch (frequency) {
      case Frequency.twice_A_Week:
        return 7 / 2;
      case Frequency.once_A_Week:
        return 7;
      case Frequency.once_Every_Two_Weeks:
        return 14;
      case Frequency.once_Every_Three_Weeks:
        return 21;
      case Frequency.once_Every_Month:
        return 28;
      case Frequency.once_Every_Two_Months:
        return 60;
      case Frequency.once_Every_Quarter_Year:
        return (365 / 12) * 3;
    }

    Sentry.captureException(
      new Error(`unhandled Frequency ${frequency} in frequencyToDays`),
    );

    return 7;
  }

  private notify = (person: Person): void => {
    this.notifyCallback({
      largeIcon: 'ic_contact_phone',
      message: 'They want to hear from you!',
      smallIcon: 'ic_contact_phone',
      tag: person.contact.recordId,
      title: `Call ${person.contact.name} now!`,
    });
  }
}
