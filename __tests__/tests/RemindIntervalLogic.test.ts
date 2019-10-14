import moment from 'moment';
import { defaultReminder } from '../../src/lib/Constants';
import RemindIntervalLogic from '../../src/lib/RemindIntervalLogic';
import { RemindIntervalLogicTestCase } from '../Types';

const testCases = [
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 0, 0, 0), 2, 7),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 6, 0, 0), 2, 12),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 8, 0, 0), 2, 10),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 0, 0, 0), -2, 7),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 6, 0, 0), -2, 1),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 8, 0, 0), -2, 10),
  new RemindIntervalLogicTestCase(new Date(2019, 9, 23, 16, 0, 0), -28, 2),
];

// 12 hour interval
const previousRemindIntervalMillis = 12 * 60 * 60 * 1000;

testCases.forEach((testCase, index) => {
  it(`case #${index}`, () => {
    const intervals = new RemindIntervalLogic().getRemindIntervals(
      moment(testCase.now),
      previousRemindIntervalMillis,
      [
        {
          daysLeftTillCallNeeded: testCase.hoursLeftTillCallNeeded / 24,
          // @ts-ignore: Make fake person for test
          person: { reminders: defaultReminder },
        },
      ],
    );

    const minInterval = Math.min(...intervals);

    expect(minInterval).toBe(testCase.intervalHours * 60);
  });
});

it(`case skip to next interval`, () => {
  const intervals = new RemindIntervalLogic().getRemindIntervals(
    moment(new Date(2019, 9, 23, 6, 30, 0)),
    previousRemindIntervalMillis,
    [
      {
        daysLeftTillCallNeeded: -2 / 24,
        // @ts-ignore: Make fake person for test
        person: { reminders: defaultReminder },
      },
    ],
  );

  const minInterval = Math.min(...intervals);

  expect(minInterval).toBe(12 * 60 - 30); // 12 hours ahead, minus the 30 minutes from the start datetime
});
