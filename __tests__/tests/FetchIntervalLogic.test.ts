import moment from 'moment';
import { RRuleSet } from 'rrule';
import FetchIntervalLogic from '../../src/lib/FetchIntervalLogic';
import { FetchIntervalLogicTestCase } from '../Types';

const testCases = [
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 0, 0, 0), 2, 7),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 6, 0, 0), 2, 12),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 8, 0, 0), 2, 10),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 0, 0, 0), -2, 7),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 6, 0, 0), -2, 1),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 8, 0, 0), -2, 10),
  new FetchIntervalLogicTestCase(new Date(2019, 9, 23, 16, 0, 0), -28, 2),
];

testCases.forEach((testCase, index) => {
  it(`case #${index}`, () => {
    const minInterval = new FetchIntervalLogic(moment(testCase.now))

      .getMinimumFetchInterval([
        {
          daysLeftTillCallNeeded: testCase.hoursLeftTillCallNeeded / 24,
          // @ts-ignore: Make fake person for test
          person: { reminders: new RRuleSet() },
        },
      ]);

    expect(minInterval).toBe(testCase.intervalMinutes * 60);
  });
});
