import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';
import Format from '../lib/Format';
import { Call, GetLogCallback } from '../Types';

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

  return granted === PermissionsAndroid.RESULTS.GRANTED ? await getLog() : [];
};

export const getLog: GetLogCallback = async () => {
  // TODO: use load(LIMIT); compare to max perodicity, to reduce processing
  const log = (await CallLogs.loadAll()) as Call[];

  const parsedLog = log.map(
    (call) =>
      new Call(
        call.dateTime,
        call.duration,
        call.name,

        new Format().formatPhoneNumber(call.phoneNumber),
        call.rawType,
        call.timestamp,
        call.type,
      ),
  );

  return parsedLog;
};
