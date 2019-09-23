import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { CallTestCase } from '../Types';

const missedTestCases = [
  [
    new CallTestCase(CallType.MISSED, 5, Frequency.once_Every_Two_Weeks, -21, 1),
  ],
  [new CallTestCase(CallType.MISSED, 5, Frequency.once_Every_Two_Weeks, -7, 1)],
];

missedTestCases.forEach(runTestCase);
