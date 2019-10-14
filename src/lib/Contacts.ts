import { PermissionsAndroid } from 'react-native';
import { Contact, selectContact } from 'react-native-select-contact';
import Sentry from 'react-native-sentry';

export const chooseContactWithPermissions = async (): Promise<Contact | null> => {
  try {
    const response = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
      {
        buttonPositive: 'Ok',
        message:
          'Call Your People needs access to your contacts ' +
          "so you can select who's phone numbers to track.",
        title: 'Call Your People Contacts Permission',
      },
    );
    if (response === PermissionsAndroid.RESULTS.GRANTED) {
      return await selectContact();
    }
  } catch (error) {
    Sentry.captureException(error);
  }

  return null;
};
