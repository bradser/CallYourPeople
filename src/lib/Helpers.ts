import moment from 'moment';

export const getHourText = (hour: number): string =>
  moment(hour, 'hour').format('ha');

export const flatMap = (f, xs) => xs.reduce((acc, x) => acc.concat(f(x)), []);
