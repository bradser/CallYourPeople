import { NativeModules } from 'react-native';
import { launchContact } from '../components/Link';
import { SettingsStore } from './store/Settings';

export const flatMap = (f, xs) => xs.reduce((acc, x) => acc.concat(f(x)), []);

export const fremiumCheckedLaunchContact = async (
  settingsStore: SettingsStore,
  contactRecordId: string,
): Promise<void> => {
  if (!settingsStore.isPremium.get()) {
    await NativeModules.Ads.showInterstitial();
  }

  await launchContact(contactRecordId);
};
