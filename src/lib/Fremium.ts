import * as RNIap from 'react-native-iap';
import Sentry from 'react-native-sentry';
import { Store } from './Store';

export default class Fremium {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public initialize = async (): Promise<void> => {
    if (!this.store.settings.isPremium) {
      const history = await RNIap.getAvailablePurchases();

      this.store.setIsPremium(history.length > 0);
    }
  }

  public canAddContacts = (): boolean =>
    this.store.people.length < 4 || this.store.settings.isPremium

  public upgrade = async (): Promise<void> => {
    try {
      const products = await RNIap.getProducts(['Premium']);

      if (products.length <= 0) {
        Sentry.captureException(new Error('RNIap.getProducts: empty response'));
      } else {
        const purchase = await RNIap.buyProduct('Premium');

        if (purchase && purchase.receiptId) {
          await RNIap.notifyFulfillmentAmazon(purchase.receiptId, 'FULFILLED');

          await RNIap.consumeAllItems();

          this.store.setIsPremium(true);
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
