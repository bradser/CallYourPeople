import moment from 'moment';
import AppLogic from '../../src/lib/AppLogic';
import { CallType, Frequency } from '../../src/Types';
import { getCall, getPerson } from '../Helpers';
import { PersonCallTestCase } from '../Types';

const addedCallsTestCases = [
  [
    new PersonCallTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      7,
      0,
      7,
    ),
    new PersonCallTestCase(
      'Gayle Serbus',
      '+8106385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      21,
      0,
      7,
    ),
  ],
  [
    new PersonCallTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      21,
      2,
      -7,
    ),
    new PersonCallTestCase(
      'Gayle Serbus',
      '+8106385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      28,
      2,
      -7,
    ),
  ],
];

addedCallsTestCases.forEach((testCase, index) => {
  it(`added calls case #${index}`, () => {
    const now = moment();

    const testPeople = [
      getPerson(
        testCase[0].name,
        testCase[0].phoneNumber,
        testCase[0].frequency,
        [],
        [],
      ),
      getPerson(
        testCase[1].name,
        testCase[1].phoneNumber,
        testCase[1].frequency,
        [
          getCall(now)(
            testCase[1].phoneNumber,
            testCase[0].callType,
            testCase[0].daysDelta,
            testCase[0].callDurationSeconds,
          ),
        ],
        [],
      ),
    ];

    const testLog = [
      getCall(now)(
        testCase[0].phoneNumber,
        testCase[0].callType,
        testCase[0].daysDelta,
        testCase[0].callDurationSeconds,
      ),
    ];

    const notify = jest.fn();

    const checkedPeople = new AppLogic(notify, now.clone()).checkCallLog(
      testPeople,
      testLog,
    );

    expect(notify).toHaveBeenCalledTimes(testCase[0].notifyCount);

    expect(checkedPeople[0].daysLeftTillCallNeeded).toBe(
      testCase[0].daysLeftTillCallNeeded,
    );

    expect(checkedPeople[1].daysLeftTillCallNeeded).toBe(
      testCase[1].daysLeftTillCallNeeded,
    );
  });
});

const removedCallsTestCases = [
  [
    new PersonCallTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      7,
      1,
      7,
    ),
    new PersonCallTestCase(
      'Gayle Serbus',
      '+8106385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      7,
      1,
      0,
    ),
  ],
  [
    new PersonCallTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      21,
      2,
      -7,
    ),
    new PersonCallTestCase(
      'Gayle Serbus',
      '+8106385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      28,
      2,
      0,
    ),
  ],
];

removedCallsTestCases.forEach((testCase, index) => {
  it(`removed calls case #${index}`, () => {
    const now = moment();

    const testPeople = [
      getPerson(
        testCase[0].name,
        testCase[0].phoneNumber,
        testCase[0].frequency,
      ),
      getPerson(
        testCase[1].name,
        testCase[1].phoneNumber,
        testCase[1].frequency,
        [],
        [
          getCall(now)(
            testCase[1].phoneNumber,
            testCase[1].callType,
            testCase[1].daysDelta,
            testCase[1].callDurationSeconds,
          ),
        ],
      ),
    ];

    const testLog = [
      getCall(now)(
        testCase[0].phoneNumber,
        testCase[0].callType,
        testCase[0].daysDelta,
        testCase[0].callDurationSeconds,
      ),
      getCall(now)(
        testCase[1].phoneNumber,
        testCase[1].callType,
        testCase[1].daysDelta,
        testCase[1].callDurationSeconds,
      ),
    ];

    const notify = jest.fn();

    const checkedPeople = new AppLogic(notify, now.clone()).checkCallLog(
      testPeople,
      testLog,
    );

    expect(notify).toHaveBeenCalledTimes(testCase[0].notifyCount);

    expect(checkedPeople[0].daysLeftTillCallNeeded).toBe(
      testCase[0].daysLeftTillCallNeeded,
    );

    expect(checkedPeople[1].daysLeftTillCallNeeded).toBe(
      testCase[1].daysLeftTillCallNeeded,
    );
  });
});
