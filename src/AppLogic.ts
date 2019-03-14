import AsyncStorage from '@react-native-community/async-storage';
import { PhoneNumberUtil } from 'google-libphonenumber';
import moment from 'moment';
import { PhoneEntry } from 'react-native-select-contact';
import { Sentry } from 'react-native-sentry';
import {
  Call,
  CallType,
  Found,
  Frequency,
  GetLogCallback,
  NotifyCallback,
  Person,
} from './Types';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

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
    let log = [];

    try {
      [storageData, log] = await Promise.all([
        AsyncStorage.getItem('data'),
        getLog(),
      ]);
    } catch (error) {
      Sentry.captureException(error);
    }

    const storagePeople = storageData ? JSON.parse(storageData) : [];

    const checkedPeople = this.checkCallLog(storagePeople, log);

    return new CheckOutput(checkedPeople, log);
  }

  public checkCallLog = (people: Person[], callLog: Call[]): Person[] =>
    people.map((person: Person) => {
      const found = this.findPhoneAndCall(person, callLog);

      // If there was never a call to/from this person, notify immediately
      if (!found.call || this.checkCall(person, found.call)) {
        this.notify(person, found.phone);
      }

      return new Person(
        person.contact,
        person.frequency,
        this.getDays(person, found.call),
      );
    })

  public daysLeftTillCallNeeded = (
    person: Person,
    callDate: string,
  ): number => {
    const daysSinceLastCall = this.callDateToDaysSinceLastCall(callDate);

    const frequencyDays = this.frequencyToDays(person);

    const daysRemaining = frequencyDays - daysSinceLastCall;

    return Math.round(daysRemaining * 10) / 10;
  }

  private findPhoneAndCall = (person: Person, callLog: Call[]): Found => {
    const PNFE164 = 0;
    let phone: PhoneEntry | undefined;

    const call = callLog.find((c) => {
      phone = person.contact.phones.find((p) => {
        try {
          const parsedPhone = phoneNumberUtil.parse(p.number, 'US');

          return c.phoneNumber === phoneNumberUtil.format(parsedPhone, PNFE164);
        } catch (error) {
          return false;
        }
      });

      return Boolean(phone);
    });

    // If there was never a call to this person, default to the first phone found
    return new Found(
      phone || (person.contact.phones && person.contact.phones[0]),
      call,
    );
  }

  private getDays = (person: Person, foundCall: Call | undefined): number =>
    Boolean(foundCall)
      ? this.daysLeftTillCallNeeded(person, foundCall!!.callDate)
      : 0

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

  private checkCall = (person: Person, call: Call): boolean => {
    if (call.callType === CallType.MISSED) {
      return true;
    }

    if (this.isVoicemail(call)) {
      if (call.callType === CallType.INCOMING) {
        return true;
      }

      if (call.callType === CallType.OUTGOING) {
        return this.callDateToDaysSinceLastCall(call.callDate) > 2;
      }

      Sentry.captureException(
        new Error(
          `unexpected CallType ${
            call.callType
          } in checkCall's isVoicemail check`,
        ),
      );

      return false;
    }

    const daysLeft = this.daysLeftTillCallNeeded(person, call.callDate);

    return daysLeft <= 0;
  }

  private isVoicemail = (call: Call): boolean => call.callDuration <= 2;

  private callDateToDaysSinceLastCall = (callDate: string): number =>
    Math.abs(this.rightNow.diff(new Date(parseInt(callDate, 10)), 'minutes')) /
    (60 * 24)

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
}
