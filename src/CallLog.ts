import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';

export const getLogWithPermissions = async (): Promise<object | []> => {
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

export const getLog = (): Promise<object> => {
  return new Promise((resolve) =>
    CallLogs.show((logs: string) => {
      const parsedLogs = JSON.parse(logs);

      resolve(parsedLogs);
    }),
  );
};
