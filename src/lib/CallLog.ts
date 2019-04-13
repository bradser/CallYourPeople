import { PhoneNumberUtil } from 'google-libphonenumber';
import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';
import { Call, GetLogCallback } from '../Types';
import { formatPhoneNumber } from './Helpers';

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

  return granted === PermissionsAndroid.RESULTS.GRANTED
    ? await getLog()
    : [];
};

export const getLog: GetLogCallback = async () => {
  const log = (await CallLogs.loadAll()) as Call[];

  const phoneNumberUtil = PhoneNumberUtil.getInstance();

  const parsedLog = log.map((call) => ({
    ...call,
    phoneNumber: formatPhoneNumber(phoneNumberUtil, call.phoneNumber),
  }));

  return parsedLog;
};