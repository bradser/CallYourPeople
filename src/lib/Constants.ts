import RRule from 'rrule';

export const cypGreen = 'greenyellow';

export const materialUILayout = {
  buttonHeight: 36,
  highRowHeight: 32,
  horizontalSpace: 8,
  margin: 16,
  rowHeight: 48,
  rowMargin: 24,
  smallSpace: 4,
};

export const weekdaysNarrowPlus = ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'];

export const defaultReminder = [
  new RRule({
    byhour: [7, 18],
    byminute: [0],
    bysecond: [0],
    byweekday: [0, 1, 2, 3, 4, 5, 6],
    count: 1,
    freq: RRule.DAILY,
    interval: 1,
  }),
];

export const hours = [
  '12 am',
  '1 am',
  '2 am',
  '3 am',
  '4 am',
  '5 am',
  '6 am',
  '7 am',
  '8 am',
  '9 am',
  '10 am',
  '11 am',
  '12 pm',
  '1 pm',
  '2 pm',
  '3 pm',
  '4 pm',
  '5 pm',
  '6 pm',
  '7 pm',
  '8 pm',
  '9 pm',
  '10 pm',
  '11 pm',
];

export const weekdaysAbbreviations = new Map([
  [[0, 1, 2, 3, 4].toString(), 'M-F'],

  [[1, 2, 3, 4].toString(), 'T-F'],
  [[0, 2, 3, 4].toString(), 'M, W-F'],
  [[0, 1, 2, 4].toString(), 'M-W, F'],
  [[0, 1, 2, 3].toString(), 'M-Th'],

  [[0, 1, 2].toString(), 'M-W'],
  [[1, 2, 3].toString(), 'T-Th'],
  [[2, 3, 4].toString(), 'W-F'],
]);
