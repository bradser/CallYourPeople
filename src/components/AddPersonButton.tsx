import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { PureComponent } from 'react';
import { StyleSheet } from 'react-native';
import { Contact } from 'react-native-select-contact';
import * as MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Contacts from '../lib/Contacts';
import { formatPhoneNumber } from '../lib/Helpers';
import { Frequency, Person } from '../Types';

interface Props {
  onPress: (person: Person) => void;
}

export default class AddPersonButton extends PureComponent<Props> {
  private phoneNumberUtil = PhoneNumberUtil.getInstance();

  public render() {
    return (
      <MaterialIcon.Button
        name='person-add'
        onPress={this.addPerson}
        style={styles.addButton}
      >
        Add Person
      </MaterialIcon.Button>
    );
  }

  private addPerson = (): void => {
    Contacts().then((selectedContact) => {
      if (selectedContact) {
        if (!selectedContact.phones || selectedContact.phones.length === 0) {
          alert('This contact has no phone number.');

          return;
        }

        const newPerson = new Person(
          this.formatPhones(selectedContact),
          Frequency.once_A_Week,
          0,
        );

        this.props.onPress(newPerson);
      }
    });
  }

  private formatPhones = (contact: Contact): Contact => {
    const phones = contact.phones.map((phoneEntry) => ({
      number: formatPhoneNumber(this.phoneNumberUtil, phoneEntry.number),
      type: phoneEntry.type,
    }));

    return { ...contact, phones };
  }
}

const styles = StyleSheet.create({
  addButton: { alignSelf: 'center' },
});
