import { PermissionsAndroid } from "react-native";
import CallLogs from "react-native-call-log";

export const getLogWithPermissions = (): Promise<object> => {
  return PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
    {
      title: "Call Your People Call Log Permission",
      message:
        "Call Your People needs access to your call log " +
        "so it can tell you when to call."
    }
  ).then(getLog);
};

export const getLog = (): Promise<object> => {
  return new Promise(resolve =>
        CallLogs.show((logs: string) => {
          const parsedLogs = JSON.parse(logs);

          resolve(parsedLogs);
        })
      );
};
