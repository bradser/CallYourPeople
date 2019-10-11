// tslint:disable:max-classes-per-file
import { decorate, observable } from 'mobx';
import moment from 'moment';
import { Contact, PhoneEntry } from 'react-native-select-contact';
import { NavigationParams } from 'react-navigation';
import RRule from 'rrule';
import { weekdaysAbbreviations, weekdaysNarrowPlus } from './lib/Constants';
import { flatMap } from './lib/Helpers';

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
  twiceAWeek,
  onceAWeek,
  onceEveryTwoWeeks,
  onceEveryThreeWeeks,
  onceEveryMonth,
  onceEveryTwoMonths,
  onceEveryQuarterYear,
}

export interface FrequencyValues {
  text: string;
  value: number;
}

export const FREQUENCY_MAP = new Map<number, FrequencyValues>([
  [Frequency.twiceAWeek, { text: '2/week', value: 7 / 2 }],
  [Frequency.onceAWeek, { text: '1 week', value: 7 }],
  [Frequency.onceEveryTwoWeeks, { text: '2 weeks', value: 14 }],
  [Frequency.onceEveryThreeWeeks, { text: '3 weeks', value: 21 }],
  [Frequency.onceEveryMonth, { text: '1 month', value: 28 }],
  [Frequency.onceEveryTwoMonths, { text: '2 months', value: 60 }],
  [
    Frequency.onceEveryQuarterYear,
    { text: '1/4 year', value: (365 / 12) * 3 },
  ],
]);

export interface LabelItem {
  getLabel(): string;
}

export interface SelectedItem<T> extends LabelItem {
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
          count: 2, // To allow for handling of JobScheduler imprecision
          freq: RRule.DAILY,
          interval: 1,
        }),
    );

    return converted;
  }

  constructor(
    public days: Set<number> = new Set<number>(),
    public hour: number = 0,
  ) {}

  public isEqual = (item: CypRRule) =>
    [...this.days].sort().toString() === [...item.days].sort().toString() &&
    this.hour === item.hour

  public getLabel = () =>
    this.abbreviateDays() + ' : ' + this.getHourText(this.hour)

  private abbreviateDays = (): string => {
    const weekdays = Array.from(this.days)
      .filter((day) => day <= 4)
      .sort();

    let out = weekdaysAbbreviations.has(weekdays.toString())
      ? weekdaysAbbreviations.get(weekdays.toString())
      : weekdays.map((day) => weekdaysNarrowPlus[day]).join(', ');

    const weekendDays = Array.from(this.days).filter((day) => day >= 5);

    if (weekendDays.length > 0) {
      if (out!.length > 0) {
        out += ', ';
      }

      out += weekendDays
          .sort()
          .map((day) => weekdaysNarrowPlus[day])
          .join(', ');
    }

    return out!;
  }

  private getHourText = (hour: number): string =>
    moment(hour, 'hour').format('ha')
}
