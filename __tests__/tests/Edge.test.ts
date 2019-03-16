import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { TestCase } from '../Types';

const edgeTestCases = [
    [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 15, 1)],
    [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 14, 1)],
    [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 13, 0)],
    [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 15, 1)],
    [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 14, 1)],
    [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 13, 0)],
  ];

edgeTestCases.forEach(runTestCase);
