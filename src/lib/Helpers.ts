import { PhoneNumberUtil } from 'google-libphonenumber';
import DeviceInfo from 'react-native-device-info';

export const formatPhoneNumber = (
  phoneNumberUtil: PhoneNumberUtil,
  phoneNumber: string,
): string => {
  let formattedPhone;

  try {
    const parsedPhone = phoneNumberUtil.parse(phoneNumber, DeviceInfo.getDeviceCountry());

    const PNFE164 = 0;
    formattedPhone = phoneNumberUtil.format(parsedPhone, PNFE164);
  } catch (error) {
    formattedPhone = phoneNumber;
  }

  return formattedPhone;
};
