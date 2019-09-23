import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { CallTestCase } from '../Types';

const edgeTestCases = [
  [
    new CallTestCase(
      CallType.INCOMING,
      5,
      Frequency.once_Every_Two_Weeks,
      -15,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      5,
      Frequency.once_Every_Two_Weeks,
      -14,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      5,
      Frequency.once_Every_Two_Weeks,
      -13,
      0,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      5,
      Frequency.once_Every_Two_Weeks,
      -15,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      5,
      Frequency.once_Every_Two_Weeks,
      -14,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      5,
      Frequency.once_Every_Two_Weeks,
      -13,
      0,
    ),
  ],
];

edgeTestCases.forEach(runTestCase);
