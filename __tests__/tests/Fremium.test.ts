import Fremium from '../../src/lib/Fremium';
import { FremiumTestCase } from '../Types';

const fremiumTestCases = [
  new FremiumTestCase([], false),
  new FremiumTestCase([undefined], true),
  new FremiumTestCase([null], true),
  new FremiumTestCase([(new Date().getTime() - 100000).toString()], false),
  new FremiumTestCase([(new Date().getTime() + 100000).toString()], true),
  new FremiumTestCase(
    [
      (new Date().getTime() + 100000).toString(),
      (new Date().getTime() - 100000).toString(),
    ],
    true,
  ),
  new FremiumTestCase(
    [
      (new Date().getTime() - 100000).toString(),
      (new Date().getTime() + 100000).toString(),
    ],
    true,
  ),
  new FremiumTestCase([null, (new Date().getTime() - 100000).toString()], true),
  new FremiumTestCase([(new Date().getTime() - 100000).toString(), null], true),
  new FremiumTestCase([null, (new Date().getTime() + 100000).toString()], true),
  new FremiumTestCase([(new Date().getTime() + 100000).toString(), null], true),
];

fremiumTestCases.forEach((testCase, index) => {
  it(`fremium calls case #${index}`, () => {
    const isPremium = Fremium.checkIsPremium(testCase.purchases, new Date());

    expect(isPremium).toEqual(testCase.isPremium);
  });
});
