import moment from 'moment';
import AppLogic from '../src/AppLogic';
import { Call, CallType, Frequency, Person } from '../src/Types';

class TestCase {
  public callDurationSeconds: number;

  constructor(
    public callType: CallType,
    callDurationMinutes: number,
    public frequency: Frequency,
    public daysDelta: number,
    public notifyCount: number,
  ) {
    this.callDurationSeconds = callDurationMinutes * 60;
  }
}

// tslint:disable-next-line: max-classes-per-file
class DuplicateTestCase extends TestCase {
  constructor(
    public name: string,
    public phoneNumber: string,
    public frequency: Frequency,
    public callType: CallType,
    callDurationMinutes: number,
    public daysDelta: number,
    public notifyCount: number,
    public daysLeftTillCallNeeded: number,
  ) {
    super(callType, callDurationMinutes, frequency, daysDelta, notifyCount);
  }
}

const getPerson = (
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

const now = moment();

const getCall = (
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
      .subtract(daysDelta, 'days')
      .valueOf()
      .toString(),
    callDuration,
    '',
  );

const testCases = [
  // normal
  [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
  [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],
  [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
  [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 7, 0)],

  // missed
  [new TestCase(CallType.MISSED, 5, Frequency.once_Every_Two_Weeks, 21, 1)],
  [new TestCase(CallType.MISSED, 5, Frequency.once_Every_Two_Weeks, 7, 1)],

  // voicemail
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 21, 1)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 15, 1)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 14, 1)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 13, 1)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 3, 1)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 2, 0)],
  [new TestCase(CallType.OUTGOING, 1, Frequency.once_Every_Two_Weeks, 1, 0)],

  [new TestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 21, 1)],
  [new TestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 7, 1)],
  [new TestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 3, 1)],
  [new TestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 2, 1)],
  [new TestCase(CallType.INCOMING, 1, Frequency.once_Every_Two_Weeks, 1, 1)],

  // edge cases
  [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 15, 1)],
  [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 14, 1)],
  [new TestCase(CallType.INCOMING, 5, Frequency.once_Every_Two_Weeks, 13, 0)],
  [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 15, 1)],
  [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 14, 1)],
  [new TestCase(CallType.OUTGOING, 5, Frequency.once_Every_Two_Weeks, 13, 0)],
];

testCases.forEach((testCase, index) => {
  it(`case #${index}`, () => {
    const testPeople = [
      getPerson('Shelley McIntyre', '+12062954055', testCase[0].frequency),
    ];

    const testLog = [
      getCall(
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
});

// same number, different names, same returned delta
const duplicateTestCases = [
  [
    new DuplicateTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      7,
      0,
      7,
    ),
    new DuplicateTestCase(
      'Gayle Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      7,
      0,
      7,
    ),
  ],
  [
    new DuplicateTestCase(
      'Joe Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      21,
      2,
      -7,
    ),
    new DuplicateTestCase(
      'Gayle Serbus',
      '+3136385505',
      Frequency.once_Every_Two_Weeks,
      CallType.OUTGOING,
      5,
      21,
      2,
      -7,
    ),
  ],
];

duplicateTestCases.forEach((testCase, index) => {
  it(`duplicate case #${index}`, () => {
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
      ),
    ];

    const testLog = [
      getCall(
        '+3136385505',
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
