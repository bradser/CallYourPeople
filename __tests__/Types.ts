import { CallType, Frequency } from '../src/Types';

export class TestCase {
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

// tslint:disable-next-line: max-classes-per-file
export class DuplicateTestCase extends TestCase {
  constructor(
    public name: string,
    public phoneNumber: string,
    public frequency: Frequency,
    public callType: CallType,
    callDurationMinutes: number,
    public daysDelta: number,
    public notifyCount: number,
    public daysLeftTillCallNeeded: number,
  ) {
    super(callType, callDurationMinutes, frequency, daysDelta, notifyCount);
  }
}