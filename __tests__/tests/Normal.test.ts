import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { CallTestCase } from '../Types';

const normalTestCases = [
    [new CallTestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new CallTestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],
    [new CallTestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new CallTestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],
  ];

normalTestCases.forEach(runTestCase);
