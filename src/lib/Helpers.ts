import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import { getLocales } from 'react-native-localize';

export const formatPhoneNumber = (
  phoneNumberUtil: PhoneNumberUtil,
  phoneNumber: string,
): string => {
  return format(
    phoneNumberUtil,
    phoneNumber,
    phoneNumber,
    PhoneNumberFormat.E164,
  );
};

export const prettifyPhoneNumber = (
  phoneNumberUtil: PhoneNumberUtil,
  phoneNumber: string,
): string => {
  return format(phoneNumberUtil, phoneNumber, '', PhoneNumberFormat.NATIONAL);
};

const format = (
  phoneNumberUtil: PhoneNumberUtil,
  phoneNumber: string,
  defaultPhoneNumber: string,
  formatType: number,
): string => {
  let formattedPhone;

  try {
    if (PhoneNumberUtil.isViablePhoneNumber(phoneNumber)) {
      const parsedPhone = phoneNumberUtil.parse(
        phoneNumber,
        getLocales()[0].countryCode,
      );

      formattedPhone = phoneNumberUtil.format(parsedPhone, formatType);
    } else {
      formattedPhone = defaultPhoneNumber;
    }
  } catch (error) {
    formattedPhone = defaultPhoneNumber;
  }

  return formattedPhone;
};
