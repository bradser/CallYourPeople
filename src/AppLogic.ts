import moment from "moment";
import { AsyncStorage, Alert } from "react-native";
import { PhoneNumberUtil, PhoneNumberFormat } from "google-libphonenumber";
import { Call, Found, Frequency, Person, CallType } from "./Types";
import { default as getLog } from "./CallLog";
import { PhoneEntry } from "react-native-select-contact";
const phoneNumberUtil = PhoneNumberUtil.getInstance();

export default class AppLogic {
  private notfy: any;

  constructor(notfy: Function) {
    this.notfy = notfy;
  }

  public check = () =>
    Promise.all([AsyncStorage.getItem("data"), getLog()])
      .then(results => {
        const storagePeople = results[0] ? JSON.parse(results[0]) : [];

        const checkedPeople = this.checkCallLog(storagePeople, results[1]);

        return { people: checkedPeople, log: results[1] };
      })
      .catch(e => {
        Alert.alert(`Error: ${e.message}`);
      });

  public checkCallLog = (people: Person[], callLog: Call[]): Person[] => {
    return people.map(person => {
      const found = this.findPhoneAndCall(person, callLog);

      if (!found.call || this.checkCall(person, found.call)) {
        this.notify(person, found.phone);
      }

      return {
        ...person,
        daysLeftTillCallNeeded: this.getDays(person, found.call)
      };
    });
  };

  private findPhoneAndCall = (person: Person, callLog: Call[]): Found => {
    const PNFE164 = 0;
    let phone: PhoneEntry | undefined;
    const call = callLog.find(call => {
      phone = person.contact.phones.find(phone => {
        try {
          const parsedPhone = phoneNumberUtil.parse(phone.number, "US");

          return (
            call.phoneNumber === phoneNumberUtil.format(parsedPhone, PNFE164)
          );
        } catch (error) {
          return false;
        }
      });

      return Boolean(phone);
    });

    return {
      phone: phone || (person.contact.phones && person.contact.phones[0]),
      call
    };
  };

  private getDays = (person: Person, foundCall: Call | undefined): number =>
    Boolean(foundCall)
      ? Math.round(
          this.daysLeftTillCallNeeded(person, foundCall!!.callDate) * 10
        ) / 10
      : 0;

  private notify = (
    person: Person,
    foundPhone: PhoneEntry | undefined
  ): void => {
    this.notfy({
      title: `Call ${person.contact.name} now!`,
      body: "They want to hear from you!",
      extra: foundPhone && foundPhone.number
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

      throw Error(
        `unexpected CallType ${call.callType} in checkCall's isVoicemail check`
      );
    }

    return this.daysLeftTillCallNeeded(person, call.callDate) <= 0;
  };

  private isVoicemail = (call: Call): boolean => call.callDuration <= 2;

  private callDateToDaysSinceLastCall = (callDate: string): number =>
    Math.abs(moment().diff(new Date(parseInt(callDate)), "minutes")) /
    (60 * 24);

  public daysLeftTillCallNeeded = (
    person: Person,
    callDate: string
  ): number => {
    const daysSinceLastCall = this.callDateToDaysSinceLastCall(callDate);

    const frequencyDays = this.frequencyToDays(person);

    const daysRemaining = frequencyDays - daysSinceLastCall;

    return daysRemaining;
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

    throw Error(`unhandled Frequency ${frequency} in frequencyToDays`);
  };
}
