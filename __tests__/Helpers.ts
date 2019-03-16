
import moment from 'moment';
import AppLogic from '../src/AppLogic';
import { Call, CallType, Frequency, Person } from '../src/Types';

export const getPerson = (
    name: string,
    phoneNumber: string,
    frequency: Frequency,
  ): Person =>
    new Person(
      {
        emails: [],
        name,
        phones: [
          {
            number: phoneNumber,
            type: 'mobile',
          },
        ],
        postalAddresses: [],
        recordId: '',
      },
      frequency,
      0,
    );

export const getCall = (now) => (
        phoneNumber: string,
        callType: CallType,
        daysDelta: number,
        callDuration: number,
      ): Call =>
        new Call(
          phoneNumber,
          callType,
          now
            .clone()
             // Rather than days, to work around https://github.com/moment/moment/issues/2430
            .subtract(daysDelta * 24, 'hours')
            .valueOf()
            .toString(),
          callDuration,
          '',
        );

export const runTestCase = (testCase, index) => {
      it(`case #${index}`, () => {
      const now = moment();

      const testPeople = [
        getPerson('Shelley McIntyre', '+12062954055', testCase[0].frequency),
      ];

      const testLog = [
        getCall(now)(
          '+12062954055',
          testCase[0].callType,
          testCase[0].daysDelta,
          testCase[0].callDurationSeconds,
        ),
      ];

      const notify = jest.fn();

      new AppLogic(notify, now.clone()).checkCallLog(testPeople, testLog);

      expect(notify).toHaveBeenCalledTimes(testCase[0].notifyCount);
    });
  };
