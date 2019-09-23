// tslint:disable:max-classes-per-file
import { decorate, observable } from 'mobx';
import { Contact, PhoneEntry } from 'react-native-select-contact';
import { NavigationParams } from 'react-navigation';
import { RRuleSet } from 'rrule';

export class Person {
  constructor(
    public contact: Contact,
    public frequency: Frequency,
    public added: Call[],
    public removed: Call[],
    public nonCall: DateItem[],
    public note: string,
    public reminders: RRuleSet,
  ) {}
}

decorate(Person, {
  added: observable,
  contact: observable,
  frequency: observable,
  nonCall: observable,
  note: observable,
  removed: observable,
});

export enum Frequency {
  twice_A_Week,
  once_A_Week,
  once_Every_Two_Weeks,
  once_Every_Three_Weeks,
  once_Every_Month,
  once_Every_Two_Months,
  once_Every_Quarter_Year,
}

export interface FrequencyValues {
  text: string;
  value: number;
}

export const FrequencyMap = new Map<number, FrequencyValues>([
  [Frequency.twice_A_Week, { text: '2/week', value: 7 / 2 }],
  [Frequency.once_A_Week, { text: '1 week', value: 7 }],
  [Frequency.once_Every_Two_Weeks, { text: '2 weeks', value: 14 }],
  [Frequency.once_Every_Three_Weeks, { text: '3 weeks', value: 21 }],
  [Frequency.once_Every_Month, { text: '1 month', value: 28 }],
  [Frequency.once_Every_Two_Months, { text: '2 months', value: 60 }],
  [
    Frequency.once_Every_Quarter_Year,
    { text: '1/4 year', value: (365 / 12) * 3 },
  ],
]);

export interface SelectedItem {
  getLabel(): string;
  getId(): string;
}

export class Call implements SelectedItem {
  constructor(
    public dateTime: string,
    public duration: number,
    public name: string,
    public phoneNumber: string,
    public rawType: number,
    public timestamp: string,
    public type: CallType,
  ) {}

  public getLabel = () => this.dateTime;
  public getId = () => this.timestamp;
}

export enum CallType {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  MISSED = 'MISSED',
  UNKNOWN = 'UNKNOWN',
}

export class Found {
  constructor(public phone: PhoneEntry, public call: Call | undefined) {}
}

export type NotifyCallback = (details: object) => void;

export type GetLogCallback = () => Promise<Call[]>;

export class NotifyPerson {
  constructor(public person: Person, public daysLeftTillCallNeeded: number) {}
}

export class DetailsNavigationProps implements NavigationParams {
  constructor(public log: Call[], public contact: Contact) {}
}

export class DateItem extends Date implements SelectedItem {
  public getLabel = () => this.toDateString();
  public getId = () => this.valueOf().toString();
}
