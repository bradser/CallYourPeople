import { Frequency, Person } from './Types';
import moment from 'moment';
import { HomeScreen } from './screens/HomeScreen';

const now = moment('2013-02-15'); // temporary for testing

const check = (person: Person): boolean => {
  const daysLeftToCall = daysLeft(person);
  return daysLeftToCall <= 0;
}

export const checkPeople = (people: Person[]): boolean[] => {

    const sendAlertToPeople = people.map(person => {
        const sendAlertToPerson = check(person);

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
    const daysSinceLastCall = Math.abs(moment(newPerson.lastCall).diff(now, 'minutes')) / (60*24);
    const frequencyNum = frequencyConverter(newPerson.frequency);
    const daysRemaining = frequencyNum - daysSinceLastCall;
    return daysRemaining;
  }