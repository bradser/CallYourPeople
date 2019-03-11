import { PermissionsAndroid } from 'react-native';
import { selectContactPhone } from 'react-native-select-contact';

export default () =>
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
    title: 'Call Your People Contacts Permission',
    message:
      'Call Your People needs access to your contacts ' +
      "so you can select who's phone numbers to track.",
    buttonPositive: 'Ok'
  }).then(() => selectContactPhone());
