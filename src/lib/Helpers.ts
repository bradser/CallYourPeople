import { NativeModules } from 'react-native';
import { launchContact } from '../components/Link';
import { SettingsStore } from './store/Settings';

export const flatMap = (f, xs) => xs.reduce((acc, x) => acc.concat(f(x)), []);

export const fremiumCheckedLaunchContact = (settingsStore: SettingsStore, contactRecordId: string) => {
  if (settingsStore.isPremium.get()) {
    launchContact(contactRecordId);
  } else {
    NativeModules.Ads.showInterstitial().then(() => launchContact(contactRecordId));
  }
};
