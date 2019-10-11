import moment from 'moment';
import Sentry from 'react-native-sentry';
import { Call, CallType, FREQUENCY_MAP, Person } from '../Types';

export default class CheckLogic {
  private static VOICEMAIL_LENGTH = 2 * 60;

  constructor(private rightNow: moment.Moment) {}

  public daysLeftTillCallNeeded = (person: Person, call: Call): number => {
    const daysSince = this.callDateToDaysSinceLastCall(call.timestamp);

    if (call.type === CallType.MISSED) {
      return daysSince;
    }

    if (this.isVoicemail(call)) {
      if (call.type === CallType.INCOMING) {
        return daysSince;
      }

      if (call.type === CallType.OUTGOING) {
        // Leave a voicemail every other day, or complete a conversation
        // TODO: a user setting?
        // TODO: only if the next call is outside of the frequency?
        return 2 + daysSince;
      }

      Sentry.captureException(
        new Error(
          `unexpected CallType ${call.type} in checkCall's isVoicemail check`,
        ),
      );

      return 0;
    }

    const frequencyDays = FREQUENCY_MAP.get(person.frequency)!.value;

    return frequencyDays + daysSince;
  }

  // TODO: a user setting?
  private isVoicemail = (call: Call): boolean =>
    call.duration <= CheckLogic.VOICEMAIL_LENGTH

  private callDateToDaysSinceLastCall = (timestamp: string): number =>
    moment(parseInt(timestamp, 10)).diff(this.rightNow, 'minutes') / (60 * 24)
}
