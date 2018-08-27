import { PermissionsAndroid } from 'react-native';
import CallLogs from 'react-native-call-log';

export default (): Promise<any> => {
    return (new Promise(resolve => setTimeout(resolve, 1000))) // setTimeout needed to work around a timing issue
        .then(() => PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CALL_LOG,
            {
                'title': 'Call Your Mom Call Log Permission',
                'message': 'Call Your Mom needs access to your call log ' +
                            'so it can tell you when to call.'
            }))
        .then(value => (new Promise(resolve =>
            CallLogs.show((logs: string) => {
                const parsedLogs = JSON.parse(logs);
                
                resolve(parsedLogs);
            }))));
};