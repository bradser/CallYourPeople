import { Contact, PhoneEntry } from "react-native-select-contact";

export interface Person {
  contact: Contact;
  frequency: Frequency;
  daysLeftTillCallNeeded: number;
}

export enum Frequency {
  twice_A_Week,
  once_A_Week,
  once_Every_Two_Weeks,
  once_Every_Three_Weeks,
  once_Every_Month,
  once_Every_Two_Months,
  once_Every_Quarter_Year
}

export const FrequencyText = [
  "Twice a week",
  "Once a week",
  "Every 2 weeks",
  "Every 3 weeks",
  "Every Month",
  "Every Two Months",
  "Every Season"
];

export interface Call {
  phoneNumber: string;
  callType: CallType;
  callDate: string;
  callDuration: number;
  callDayTime: string;
}

export enum CallType {
  INCOMING = "INCOMING",
  OUTGOING = "OUTGOING",
  MISSED = "MISSED"
}

export interface Found {
  phone: PhoneEntry | undefined;
  call: Call | undefined;
}
