// tslint:disable: max-classes-per-file

import { CallType, Frequency, Call } from '../src/Types';

export class CallTestCase {
  public callDurationSeconds: number;

  constructor(
    public callType: CallType,
    callDurationMinutes: number,
    public frequency: Frequency,
    public daysDelta: number,
    public notifyCount: number,
  ) {
    this.callDurationSeconds = callDurationMinutes * 60;
  }
}

export class PersonCallTestCase extends CallTestCase {
  constructor(
    public name: string,
    public phoneNumber: string,
    public frequency: Frequency,
    public callType: CallType, // TODO: verify super is overridden
    callDurationMinutes: number,
    public daysDelta: number,
    public notifyCount: number,
    public daysLeftTillCallNeeded: number,
  ) {
    super(callType, callDurationMinutes, frequency, daysDelta, notifyCount);
  }
}

export class PersonModifiedCallTestCase extends PersonCallTestCase {
  constructor(
    public name: string,
    public phoneNumber: string,
    public frequency: Frequency,
    public callType: CallType,
    callDurationMinutes: number,
    public daysDelta: number,
    public notifyCount: number,
    public daysLeftTillCallNeeded: number,
    public modified: Call[],
  ) {
    super(name, phoneNumber, frequency, callType, callDurationMinutes, daysDelta, notifyCount, daysLeftTillCallNeeded);
  }
}
