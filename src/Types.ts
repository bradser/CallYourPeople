// tslint:disable:max-classes-per-file
import { Contact, PhoneEntry } from 'react-native-select-contact';

export class Person {
  constructor(
    public contact: Contact,
    public frequency: Frequency,
    public daysLeftTillCallNeeded: number,
  ) {}
}

export enum Frequency {
  twice_A_Week,
  once_A_Week,
  once_Every_Two_Weeks,
  once_Every_Three_Weeks,
  once_Every_Month,
  once_Every_Two_Months,
  once_Every_Quarter_Year,
}

export const FrequencyText = [
  '2/week',
  '1 week',
  '2 weeks',
  '3 weeks',
  '1 month',
  '2 months',
  '1/4 year',
];

export class Call {
  constructor(
    public phoneNumber: string,
    public callType: CallType,
    public callDate: string,
    public callDuration: number,
    public callDayTime: string,
  ) {}
}

export enum CallType {
  INCOMING = 'INCOMING',
  OUTGOING = 'OUTGOING',
  MISSED = 'MISSED',
}

export class Found {
  constructor(
    public phone: PhoneEntry | undefined,
    public call: Call | undefined,
  ) {}
}

export type NotifyCallback = (details: object) => void;

export type GetLogCallback = () => Promise<object | []>;
