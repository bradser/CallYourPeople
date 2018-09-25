import { Frequency, Person } from './Types';
import moment from 'moment';
import { HomeScreen } from './screens/HomeScreen';
import CallLogs from 'react-native-call-log';

// look at one person and then compare it to the call log phone numbers
// if it matches then look at whether an alert to call needs to be called


const now = moment('2013-02-15'); // temporary for testing

const checkDate = (person: Person, callDate): boolean => {
  const daysLeftToCall = daysLeft(person, callDate);
  return daysLeftToCall <= 0;
}

const checkNumber = (person: Person, call): string => {
  if (person.phoneNumber === call.phoneNumber) {
    return call.phoneNumber;
  } 
}

export const checkCallLog = (people: Person[], callLog) => {
  const sendAlertToPeople = people.map(person => {
    const callerFound = callLog.find(call => {
      if (call.phoneNumber === person.phoneNumber) {
        return call.callDayTime;
      } else {
        return false;
      }
    });
    const alertCheck = checkDate(person, callerFound.callDayTime);
    if (alertCheck) {
      alert('Call ' + person.name);
    }
    return alertCheck;
  }); 
  
  return sendAlertToPeople;
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

export const daysLeft = (newPerson: Person, lastTimeCalled): number => {
    const daysSinceLastCall = Math.abs(moment(lastTimeCalled).diff(newPerson.lastCall, 'minutes')) / (60*24);
    const frequencyNum = frequencyConverter(newPerson.frequency);
    const daysRemaining = frequencyNum - daysSinceLastCall;
    return daysRemaining;
  }