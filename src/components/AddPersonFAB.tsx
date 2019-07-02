import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { PureComponent } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { FAB } from 'react-native-paper';
import { Contact } from 'react-native-select-contact';
import { cypGreen, materialUILayout } from '../lib/Constants';
import Contacts from '../lib/Contacts';
import { formatPhoneNumber } from '../lib/Helpers';
import { Frequency, Person } from '../Types';

interface Props {
  onPress: (person: Person) => void;
}

export default class AddPersonFAB extends PureComponent<Props> {
  private phoneNumberUtil = PhoneNumberUtil.getInstance();

  public render() {
    return (
      <View style={styles.view}>
        <FAB icon='person-add' onPress={this.addPerson} style={styles.fab} />
      </View>
    );
  }

  private addPerson = (): void => {
    Contacts().then((selectedContact) => {
      if (selectedContact) {
        if (!selectedContact.phones || selectedContact.phones.length === 0) {
          Alert.alert('This contact has no phone number.');

          return;
        }

        const newPerson = new Person(
          this.formatPhones(selectedContact),
          Frequency.once_A_Week,
          [],
          [],
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
  fab: {
    backgroundColor: cypGreen,
  },
  view: {
    bottom: 0,
    margin: materialUILayout.margin,
    position: 'absolute',
    right: 0,
  },
});
