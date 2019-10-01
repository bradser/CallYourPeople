import moment from 'moment';
import { PhoneEntry } from 'react-native-select-contact';
import { Call, CallType, Found, NotifyPerson, Person } from '../Types';
import CheckLogic from './CheckLogic';

export default class AppLogic {
  private static VOICEMAIL_LENGTH = 2 * 60;

  constructor(private rightNow: moment.Moment) {}

  public checkCallLog = (people: Person[], callLog: Call[]): NotifyPerson[] =>
    people
      .map((person: Person) => {
        const processedLog = this.processModifiedCalls(person, callLog);

        const found = this.findPhoneAndCall(person, processedLog);

        // If there was never a call to/from this person, notify immediately
        const days = found.call
          ? new CheckLogic(this.rightNow).daysLeftTillCallNeeded(
              person,
              found.call,
            )
          : 0;

        return new NotifyPerson(person, days);
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

    const added = person.added.map(
      (call) =>
        new Call(
          call.dateTime,
          AppLogic.VOICEMAIL_LENGTH + 1,
          call.name,
          person.contact.phones[0].number,
          call.rawType,
          call.timestamp,
          CallType.INCOMING,
        ),
    );

    const nonCall = person.nonCall.map(
      (nc) =>
        new Call(
          nc.toDateString(),
          AppLogic.VOICEMAIL_LENGTH + 1,
          '',
          person.contact.phones[0].number,
          0,
          nc.getTime().toString(),
          CallType.INCOMING,
        ),
    );

    return removed
      .concat(added)
      .concat(nonCall)
      .sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }

  private sortByDaysThenName = (a: NotifyPerson, b: NotifyPerson): number =>
    a.daysLeftTillCallNeeded === b.daysLeftTillCallNeeded
      ? a.person.contact.name <= b.person.contact.name
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
}
