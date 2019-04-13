import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import DeviceInfo from 'react-native-device-info';

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
        DeviceInfo.getDeviceCountry(),
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
