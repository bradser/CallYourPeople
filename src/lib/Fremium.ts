import * as RNIap from 'react-native-iap';
import Sentry from 'react-native-sentry';
import { Store } from './Store';

export default class Fremium {
  private store: Store;

  constructor(store: Store) {
    this.store = store;
  }

  public isPremium = async (): Promise<boolean> => {
    const history = await RNIap.getPurchaseHistory();

    return history.length > 0;
  }

  public canAddContacts = async (): Promise<boolean> =>
    this.store.peopleCount() < 4 || (await this.isPremium())

  public check = async (): Promise<any> => {
    try {
      const products = await RNIap.getProducts(['Premium']);

      if (products.length <= 0) {
        Sentry.captureException(new Error('RNIap.getProducts: empty response'));
      } else {
        const purchase = await RNIap.buyProduct('Premium');

        if (purchase && purchase.receiptId) {
          await RNIap.notifyFulfillmentAmazon(purchase.receiptId, 'FULFILLED');

          await RNIap.consumeAllItems();
        }
      }
    } catch (error) {
      Sentry.captureException(error);
    }
  }
}
