import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { getLocales } from 'react-native-localize';

export default class Format {
  private locales = getLocales();
  private phoneNumberUtil = PhoneNumberUtil.getInstance();

  public formatPhoneNumber = (phoneNumber: string): string => {
    return this.format(phoneNumber, phoneNumber, PhoneNumberFormat.E164);
  }

  public prettifyPhoneNumber = (phoneNumber: string): string => {
    return this.format(phoneNumber, '', PhoneNumberFormat.NATIONAL);
  }

  private format = (
    phoneNumber: string,
    defaultPhoneNumber: string,
    formatType: number,
  ): string => {
    let formattedPhone;

    try {
      if (PhoneNumberUtil.isViablePhoneNumber(phoneNumber)) {
        const parsedPhone = this.phoneNumberUtil.parse(
          phoneNumber,
          this.locales[0].countryCode,
        );

        formattedPhone = this.phoneNumberUtil.format(parsedPhone, formatType);
      } else {
        formattedPhone = defaultPhoneNumber;
      }
    } catch (error) {
      formattedPhone = defaultPhoneNumber;
    }

    return formattedPhone;
  }
}
