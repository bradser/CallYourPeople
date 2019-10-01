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
