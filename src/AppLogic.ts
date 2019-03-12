import AsyncStorage from '@react-native-community/async-storage';
import { PhoneNumberUtil } from 'google-libphonenumber';
import moment from 'moment';
import { PhoneEntry } from 'react-native-select-contact';
import { Call, CallType, Found, Frequency, Person } from './Types';

const phoneNumberUtil = PhoneNumberUtil.getInstance();

export class CheckOutput {
  constructor(public people: Person[], public log: any) {}
}

export default class AppLogic {
  constructor(
    private notifyCallback: Function,
    private rightNow: moment.Moment
  ) {}

  public check = async (getLog: Function): Promise<CheckOutput> => {
    let storageData = undefined;
    let log = [];

    try {
      const [storageData, log] = await Promise.all([AsyncStorage.getItem('data'), getLog()]);
    } catch (error) {
        // TODO: log to sentry
    }

    const storagePeople = storageData ? JSON.parse(storageData) : [];

    const checkedPeople = this.checkCallLog(storagePeople, log);

    return new CheckOutput(checkedPeople, log);
  }

  public checkCallLog = (people: Person[], callLog: Call[]): Person[] => (
     people.map((person: Person) => {
      const found = this.findPhoneAndCall(person, callLog);

      // If there was never a call to/from this person, notify immediately
      if (!found.call || this.checkCall(person, found.call)) {
        this.notify(person, found.phone);
      }

      return new Person(
        person.contact,
        person.frequency,
        this.getDays(person, found.call)
      );
    })
  );

  private findPhoneAndCall = (person: Person, callLog: Call[]): Found => {
    const PNFE164 = 0;
    let phone: PhoneEntry | undefined;

    const call = callLog.find(call => {
      phone = person.contact.phones.find(phone => {
        try {
          const parsedPhone = phoneNumberUtil.parse(phone.number, 'US');

          return (
            call.phoneNumber === phoneNumberUtil.format(parsedPhone, PNFE164)
          );
        } catch (error) {
          return false;
        }
      });

      return Boolean(phone);
    });

    // If there was never a call to this person, default to the first phone found
    return new Found(
      phone || (person.contact.phones && person.contact.phones[0]),
      call
    );
  };

  private getDays = (person: Person, foundCall: Call | undefined): number =>
    Boolean(foundCall)
      ? this.daysLeftTillCallNeeded(person, foundCall!!.callDate)
      : 0;

  private notify = (
    person: Person,
    foundPhone: PhoneEntry | undefined
  ): void => {
    this.notifyCallback({
      title: `Call ${person.contact.name} now!`,
      message: 'They want to hear from you!',
      tag: foundPhone && foundPhone.number
    });
  };

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

      // TODO: log to sentry
      throw Error(
        `unexpected CallType ${call.callType} in checkCall's isVoicemail check`
      );
    }

    const daysLeft = this.daysLeftTillCallNeeded(person, call.callDate);

    return daysLeft <= 0;
  };

  private isVoicemail = (call: Call): boolean => call.callDuration <= 2;

  private callDateToDaysSinceLastCall = (callDate: string): number =>
    Math.abs(this.rightNow.diff(new Date(parseInt(callDate)), 'minutes')) /
    (60 * 24);

  public daysLeftTillCallNeeded = (
    person: Person,
    callDate: string
  ): number => {
    const daysSinceLastCall = this.callDateToDaysSinceLastCall(callDate);

    const frequencyDays = this.frequencyToDays(person);

    const daysRemaining = frequencyDays - daysSinceLastCall;

    return Math.round(daysRemaining * 10) / 10;
  };

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

    // TODO log to sentry
    throw Error(`unhandled Frequency ${frequency} in frequencyToDays`);
  };
}
