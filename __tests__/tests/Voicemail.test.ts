import { CallType, Frequency } from '../../src/Types';
import { runTestCase } from '../Helpers';
import { CallTestCase } from '../Types';

const voicemailTestCases = [
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -21,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -15,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -14,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -13,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -3,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -2,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -1.9,
      0,
    ),
  ],
  [
    new CallTestCase(
      CallType.OUTGOING,
      1,
      Frequency.onceEveryTwoWeeks,
      -1,
      0,
    ),
  ],

  [
    new CallTestCase(
      CallType.INCOMING,
      1,
      Frequency.onceEveryTwoWeeks,
      -21,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      1,
      Frequency.onceEveryTwoWeeks,
      -7,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      1,
      Frequency.onceEveryTwoWeeks,
      -3,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      1,
      Frequency.onceEveryTwoWeeks,
      -2,
      1,
    ),
  ],
  [
    new CallTestCase(
      CallType.INCOMING,
      1,
      Frequency.onceEveryTwoWeeks,
      -1,
      1,
    ),
  ],
];

voicemailTestCases.forEach(runTestCase);
