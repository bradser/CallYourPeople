import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';
import { PhoneEntry } from 'react-native-select-contact';
import { Sentry } from 'react-native-sentry';
import {
  Call,
  CallType,
  Found,
  Frequency,
  GetLogCallback,
  ModifiedCalls,
  NotifyCallback,
  Person,
} from './Types';

export class CheckOutput {
  constructor(public people: Person[], public log: any) {}
}

// tslint:disable-next-line: max-classes-per-file
export default class AppLogic {
  constructor(
    private notifyCallback: NotifyCallback,
    private rightNow: moment.Moment,
  ) {}

  public check = async (getLog: GetLogCallback): Promise<CheckOutput> => {
    let storageData: string | undefined;
    let storageSettings: string | undefined;
    let log: Call[] = [];

    try {
      [storageData, storageSettings, log] = await Promise.all([
        AsyncStorage.getItem('data'),
        AsyncStorage.getItem('settings'),
        getLog(),
      ]);
    } catch (error) {
      Sentry.captureException(error);
    }

    const storagePeople = storageData ? JSON.parse(storageData) : [];

    const modifiedCalls = storageSettings
      ? JSON.parse(storageSettings).modifiedCalls
      : [];

    const checkedPeople = this.checkCallLog(storagePeople, modifiedCalls, log);

    return new CheckOutput(checkedPeople, log);
  }

  public checkCallLog = (
    people: Person[],
    modifiedCalls: ModifiedCalls[],
    callLog: Call[],
  ): Person[] =>
    people.map((person: Person) => {
      const procesedLog = this.processModifiedCalls(
        person,
        modifiedCalls,
        callLog,
      );

      const found = this.findPhoneAndCall(person, procesedLog);

      // If there was never a call to/from this person, notify immediately
      const days = found.call
        ? this.daysLeftTillCallNeeded(person, found.call)
        : 0;

      if (days <= 0) {
        this.notify(person, found.phone);
      }

      return new Person(person.contact, person.frequency, days);
    })

  public processModifiedCalls = (
    person: Person,
    modifiedCalls: ModifiedCalls[],
    callLog: Call[],
  ): Call[] => {
    const modified = modifiedCalls.find((m) => m.name === person.contact.name);

    if (modified) {
      const processed = callLog.filter(
        (call) =>
          !modified.removed.find(
            (r) =>
              r.callDate === call.callDate && r.phoneNumber === call.phoneNumber,
          ),
      );

      return processed
        .concat(modified.added)
        .sort((a, b) => (a.callDate < b.callDate ? -1 : 1));
    }

    return callLog;
  }

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
    const daysSince = this.callDateToDaysSinceLastCall(call.callDate);

    if (call.callType === CallType.MISSED) {
      return -daysSince;
    }

    if (this.isVoicemail(call)) {
      if (call.callType === CallType.INCOMING) {
        return -daysSince;
      }

      if (call.callType === CallType.OUTGOING) {
        // Leave a voicemail every other day, or complete a conversation
        // TODO: a user setting?
        // TODO: only if the next call is outside of the frequency
        return this.roundDays(2 - daysSince);
      }

      Sentry.captureException(
        new Error(
          `unexpected CallType ${
            call.callType
          } in checkCall's isVoicemail check`,
        ),
      );

      return 0;
    }

    const frequencyDays = this.frequencyToDays(person);

    return this.roundDays(frequencyDays - daysSince);
  }

  // TODO: a user setting?
  private isVoicemail = (call: Call): boolean => call.callDuration <= 2 * 60;

  private callDateToDaysSinceLastCall = (callDate: string): number =>
    Math.abs(this.rightNow.diff(new Date(parseInt(callDate, 10)), 'minutes')) /
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

  private notify = (
    person: Person,
    foundPhone: PhoneEntry | undefined,
  ): void => {
    this.notifyCallback({
      largeIcon: 'ic_contact_phone',
      message: 'They want to hear from you!',
      smallIcon: 'ic_contact_phone',
      tag: foundPhone && foundPhone.number,
      title: `Call ${person.contact.name} now!`,
    });
  }
}
