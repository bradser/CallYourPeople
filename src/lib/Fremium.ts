import { Alert } from 'react-native';
import * as RNIap from 'react-native-iap';
import Sentry, { SentrySeverity } from 'react-native-sentry';
import { PeopleStore } from './store/People';
import { SettingsStore } from './store/Settings';

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

  constructor(
    private peopleStore: PeopleStore,
    private settingsStore: SettingsStore,
  ) {}

  public initialize = async (): Promise<void> => {
    try {
      const isLoggedIn = await this.checkLogin();
      if (!isLoggedIn) {
        return;
      }

      const purchaseHistory = await RNIap.getPurchaseHistory();

      if (purchaseHistory.length > 0) {
        this.settingsStore.userIdAmazon =
          purchaseHistory[purchaseHistory.length - 1].userIdAmazon;
      }

      const isPremium = Fremium.checkIsPremium(purchaseHistory, new Date());

      this.settingsStore.setIsPremium(isPremium);
    } catch (error) {
      Sentry.captureException(error);
    }
  }

  public canAddContacts = (): boolean =>
    this.peopleStore.people.length < 4 || this.settingsStore.isPremium.get()

  public upgrade = async (): Promise<void> => {
    try {
      const isLoggedIn = await this.checkLogin();
      if (!isLoggedIn) {
        Alert.alert(
          'Not Logged In',
          'Please log into the Amazon Appstore on your device.',
        );

        return;
      }

      const purchase = await RNIap.buyProduct('Monthly');

      if (purchase && purchase.receiptId) {
        Sentry.captureBreadcrumb({
          category: 'Purchase',
          level: SentrySeverity.Info,
          message: JSON.stringify(purchase),
        });

        await RNIap.notifyFulfillmentAmazon(purchase.receiptId, 'FULFILLED');

        this.settingsStore.setIsPremium(true);
      }
    } catch (error) {
      if (error.code === 'E_ALREADY_OWNED') {
        Alert.alert(
          'Already Purchased',
          'You have already purchased a subscription, thanks! Restoring to your device.',
        );

        this.settingsStore.setIsPremium(true);
      } else {
        Sentry.captureException(error);
      }
    }
  }

  private checkLogin = async (): Promise<boolean> => {
    let userData;
    try {
      userData = await RNIap.getUserData();
    } catch (error) {
      if (error.code === 'E_BILLING_RESPONSE_JSON_PARSE_ERROR') {
        return true;
      } else {
        Sentry.captureException(error);
      }
    }

    return Boolean(userData);
  }
}
