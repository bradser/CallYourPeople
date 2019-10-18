import { Alert } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { SettingsStore } from '../lib/store/Settings';

export default (navigation): void => {
  let output = `Device ID: ${DeviceInfo.getUniqueID()
    .toLocaleUpperCase()
    .match(/.{1,3}/g)!
    .join('-')}`;

  const userIdAmazon = (navigation.getParam('settingsStore') as SettingsStore)
    .userIdAmazon;

  if (userIdAmazon) {
    output += `\n\nAmazon User ID: ${userIdAmazon}`;
  }

  output += `\n\nVersion: ${DeviceInfo.getVersion()}`;
  
  Alert.alert('IDs', output);
};
