import * as Sentry from '@sentry/react-native';
import { Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import { Store } from './Store';

export default class Fremium {
  public static checkIsPremium = (
    purchaseHistory: RNIap.Purchase[],
    now: Date,
  ): boolean => {
    let isPremium = false;

    for (const purchase of purchaseHistory) {
      if (
        purchase.cancelDateAmazon == null ||
        parseFloat(purchase.cancelDateAmazon) > now.getTime()
      ) {
        isPremium = true;
        break;
      }
    }

    return isPremium;
  }

  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public initialize = async (): Promise<void> => {
    try {
      const purchaseHistory = await RNIap.getPurchaseHistory();

      const isPremium = Fremium.checkIsPremium(purchaseHistory, new Date());

      this.store.setIsPremium(isPremium);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  public canAddContacts = (): boolean =>
    this.store.people.length < 4 || this.store.settings.isPremium

  public upgrade = async (): Promise<void> => {
    try {
      const purchase = await RNIap.buyProduct('Monthly');

      if (purchase && purchase.receiptId) {
        Sentry.captureMessage(JSON.stringify(purchase));

        await RNIap.notifyFulfillmentAmazon(purchase.receiptId, 'FULFILLED');

        this.store.setIsPremium(true);
      }
    } catch (error) {
      if (error.code === 'E_ALREADY_OWNED') {
        Alert.alert(
          'You have already purchased a subscription. Restoring to your device.',
        );

        this.store.setIsPremium(true);
      } else {
        Alert.alert(
          'There was an error processing the purchase. Please try again later.',
        );

        Sentry.captureException(error);
      }
    }
  }
}
