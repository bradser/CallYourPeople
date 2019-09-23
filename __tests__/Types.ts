// tslint:disable: max-classes-per-file

import { ProductPurchase } from 'react-native-iap';
import { CallType, Frequency } from '../src/Types';

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

export class FremiumTestCase {
  public purchases: ProductPurchase[];
  constructor(cancelDates: Array<string | undefined | null>, public isPremium: boolean) {
    // TODO: must disable strictNullChecks to compile/run, due to issues with upstream library
    this.purchases = cancelDates.map((cancelDateAmazon) => {
      return {
        cancelDateAmazon,
        productId: '',
        receiptId: '',
        transactionDate: '',
        transactionId: '',
        transactionReceipt: '',
        userIdAmazon: '',
      };
    });
  }
}
