import { NativeModules } from 'react-native';
import { launchContact } from '../components/Link';
import { Store } from './Store';

export const flatMap = (f, xs) => xs.reduce((acc, x) => acc.concat(f(x)), []);

export const fremiumCheckedLaunchContact = (store: Store, contactRecordId: string) => {
  if (store.settings.isPremium) {
    launchContact(contactRecordId);
  } else {
    NativeModules.Ads.showInterstitial().then(() => launchContact(contactRecordId));
  }
};
