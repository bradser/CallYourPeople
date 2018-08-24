import { Frequency, Person } from './Types';
import moment from 'moment';

const now = moment('2013-02-10'); // temporary for testing

const check = (frequency: Frequency, lastCall: Date): boolean => {
    return false;
}

export const checkPeople = (people: Person[]): boolean[] => {

    const sendAlertToPeople = people.map(person => {
        const sendAlertToPerson = check(person.frequency, person.lastCall);

        if (sendAlertToPerson != person.shouldAlert) alert(person.name);

        return sendAlertToPerson;
    });

    return sendAlertToPeople;
}

export const frequencyConverter = (personFrequency: Frequency): number => {
    if (personFrequency === Frequency.twice_A_Week) {
      return 7/2;
    } else if (personFrequency === Frequency.once_A_Week) {
      return 7;
    } else if (personFrequency === Frequency.once_Every_Two_Weeks) {
      return 14;
    } else if (personFrequency === Frequency.once_Every_Three_Weeks) {
      return 21;
    } else {
      return 28;
    }
  }

export const daysLeft = (newPerson: Person): number => {
    const daysSinceLastCall = moment(newPerson.lastCall).diff(now, 'days');
    const frequencyNum = frequencyConverter(newPerson.frequency);
    const daysRemaining = frequencyNum - daysSinceLastCall;
    return daysRemaining;
  }