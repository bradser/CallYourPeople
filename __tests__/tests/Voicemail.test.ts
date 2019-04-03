import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { CallTestCase } from '../Types';

const voicemailTestCases = [
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 15, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 14, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 13, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 3, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 2, 1)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 1.9, 0)],
    [new CallTestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 1, 0)],

    [new CallTestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new CallTestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 7, 1)],
    [new CallTestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 3, 1)],
    [new CallTestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 2, 1)],
    [new CallTestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 1, 1)],
  ];

voicemailTestCases.forEach(runTestCase);
