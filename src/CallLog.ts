import { PhoneNumberUtil } from 'google-libphonenumber';
import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';
import { formatPhoneNumber } from './Helpers';
import { Call, GetLogCallback } from './Types';

export const getLogWithPermissions: GetLogCallback = async () => {
  const granted = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    {
      buttonPositive: 'Ok',
      message:
        'Call Your People needs access to your call log ' +
        'so it can tell you when to call.',
      title: 'Call Your People Call Log Permission',
    },
  );

  return granted === PermissionsAndroid.RESULTS.GRANTED ? getLog() : [];
};

export const getLog: GetLogCallback = () => {
  return new Promise((resolve) =>
    CallLogs.show((logs: string) => {
      const phoneNumberUtil = PhoneNumberUtil.getInstance();

      const parsedLogs = JSON.parse(logs, (key, value) =>
        key === 'phoneNumber'
          ? formatPhoneNumber(phoneNumberUtil, value)
          : value,
      ) as Call[];

      resolve(parsedLogs);
    }),
  );
};
