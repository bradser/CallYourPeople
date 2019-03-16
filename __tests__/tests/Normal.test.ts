import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { TestCase } from '../Types';

const normalTestCases = [
    [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],
    [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
    [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],
  ];

normalTestCases.forEach(runTestCase);
