// tslint:disable:max-classes-per-file
import { decorate, observable } from 'mobx';
import { Contact, PhoneEntry } from 'react-native-select-contact';
import { NavigationParams } from 'react-navigation';
import RRule from 'rrule';
import { weekdaysNarrowPlus } from './lib/Constants';
import { flatMap, getHourText } from './lib/Helpers';

export class Person {
  constructor(
    public contact: Contact,
    public frequency: Frequency,
    public added: Call[],
    public removed: Call[],
    public nonCall: DateItem[],
    public note: string,
    public reminders: RRule[],
  ) {}
}

decorate(Person, {
  added: observable,
  contact: observable,
  frequency: observable,
  nonCall: observable,
  note: observable,
  reminders: observable,
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

export interface SelectedItem<T> {
  getLabel(): string;
  isEqual(item: T): boolean;
}

export class Call implements SelectedItem<Call> {
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
  public isEqual = (item: Call) => this.timestamp === item.timestamp;
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

export class DateItem extends Date implements SelectedItem<DateItem> {
  public getLabel = () => this.toDateString();
  public isEqual = (item: DateItem) => this.valueOf() === item.valueOf();
}

export class CypRRule implements SelectedItem<CypRRule> {
  public static convertFromRRules = (rRules: RRule[]): CypRRule[] => {
    const converted = flatMap(
      (rrule) =>
        rrule.options.byhour.map(
          (hour) => new CypRRule(new Set<number>(rrule.options.byweekday), hour),
        ),
      rRules,
    );

    return converted;
  }

  public static convertToRRules = (cypRRules: CypRRule[]): RRule[] => {
    // from https://stackoverflow.com/a/47752730/11385892
    const daysMap = cypRRules.reduce(
      (entryMap, e) =>
        entryMap.set(JSON.stringify(Array.from(e.days)), [
          ...(entryMap.get(JSON.stringify(Array.from(e.days))) || []),
          e.hour,
        ]),
      new Map(),
    );

    const converted = Array.from(
      daysMap,
      (entry, index) =>
        new RRule({
          byhour: entry[1],
          byminute: [0],
          bysecond: [0],
          byweekday: JSON.parse(entry[0]),
          count: 1,
          freq: RRule.DAILY,
          interval: 1,
        }),
    );

    return converted;
  }

  constructor(public days: Set<number>, public hour: number) {}

  public isEqual = (item: CypRRule) =>
    [...this.days].sort().toString() === [...item.days].sort().toString() &&
    this.hour === item.hour

  public getLabel = () =>
    Array.from(this.days)
      .sort()
      .map((day) => weekdaysNarrowPlus[day])
      .join(', ') +
    ' - ' +
    getHourText(this.hour)
}
