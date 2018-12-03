import { Frequency, Person } from "./Types";
import moment from "moment";
import { NotificationsAndroid } from "react-native-notifications";
import { AsyncStorage } from "react-native";
import { default as getLog } from "./CallLog";

// look at one person and then compare it to the call log phone numbers
// if it matches then look at whether an alert to call needs to be called

const now = moment("2013-02-15"); // temporary for testing

const checkDate = (person: Person, callDate): boolean => {
  const daysLeftToCall = daysLeft(person, callDate);
  return daysLeftToCall <= 0;
};

const checkNumber = (person: Person, call): string => {
  if (person.phoneNumber === call.phoneNumber) {
    return call.phoneNumber;
  }
};

export const checkCallLog = (people: Person[], callLog) => {
  const sendAlertToPeople = people.map(person => {
    const callerFound = callLog.find(call => call.phoneNumber === person.phoneNumber);
    const alertCheck = callerFound ? checkDate(person, callerFound.callDayTime) : false;
    if (alertCheck) {
      //alert('Call ' + person.name);
      NotificationsAndroid.localNotification({
        title: `Call ${person.name} now!`,
        body: "They want to hear from you!",
        extra: person.phoneNumber
      });
    }
    return alertCheck;
  });

  return sendAlertToPeople;
};

export const checkPeople = (people: Person[]): boolean[] => {
  const sendAlertToPeople = people.map(person => {
    const sendAlertToPerson = check(person);

    if (sendAlertToPerson != person.shouldAlert) alert(person.name);

    return sendAlertToPerson;
  });

  return sendAlertToPeople;
};

export const frequencyConverter = (personFrequency: Frequency): number => {
  if (personFrequency === Frequency.twice_A_Week) {
    return 7 / 2;
  } else if (personFrequency === Frequency.once_A_Week) {
    return 7;
  } else if (personFrequency === Frequency.once_Every_Two_Weeks) {
    return 14;
  } else if (personFrequency === Frequency.once_Every_Three_Weeks) {
    return 21;
  } else {
    return 28;
  }
};

export const daysLeft = (newPerson: Person, lastTimeCalled): number => {
  const daysSinceLastCall = Math.abs(moment().diff(newPerson.lastCall, "minutes")) / (60 * 24);
  const frequencyNum = frequencyConverter(newPerson.frequency);
  const daysRemaining = frequencyNum - daysSinceLastCall;
  return daysRemaining;
};

export const check = () => {
  return Promise.all([getLog(), AsyncStorage.getItem("data")])
    .then(array => {
      const jsonData = array[1] ? JSON.parse(array[1]) : [];

      checkCallLog(jsonData, array[0]);

      return jsonData;
    })
    .catch(e => {
      console.log(e);
    });
};
