import { PhoneNumberFormat, PhoneNumberUtil } from 'google-libphonenumber';
import DeviceInfo from 'react-native-device-info';

export const formatPhoneNumber = (
  phoneNumberUtil: PhoneNumberUtil,
  phoneNumber: string,
): string => {
  let formattedPhone;

  try {
    if (PhoneNumberUtil.isViablePhoneNumber(phoneNumber)) {
      const parsedPhone = phoneNumberUtil.parse(
        phoneNumber,
        DeviceInfo.getDeviceCountry(),
      );

      formattedPhone = phoneNumberUtil.format(
        parsedPhone,
        PhoneNumberFormat.E164,
      );
    } else {
      formattedPhone = phoneNumber;
    }
  } catch (error) {
    formattedPhone = phoneNumber;
  }

  return formattedPhone;
};
