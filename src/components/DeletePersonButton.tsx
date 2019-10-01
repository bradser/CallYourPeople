import React, { Component } from 'react';
import { Alert, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { materialUILayout } from '../lib/Constants';
import { Person } from '../Types';

interface Props {
  person: Person;
  onPress: (person: Person) => void;
}

export default class DeletePersonButton extends Component<Props> {
  public render() {
    return (
      <Button
        onPress={this.deletePersonAlert}
        mode='outlined'
        icon='delete'
        color='black'
        style={styles.deleteButton}
      >
        {`Delete '${this.props.person.contact.name}'`}
      </Button>
    );
  }

  private deletePersonAlert = (): void => {
    Alert.alert(
      'Delete',
      `Are you sure you want to delete '${this.props.person.contact.name}'?`,
      [
        {
          style: 'cancel',
          text: 'Cancel',
        },
        {
          onPress: () => this.props.onPress(this.props.person),
          text: 'OK',
        },
      ],
      { cancelable: true },
    );
  }
}

const styles = StyleSheet.create({
  deleteButton: {
    alignSelf: 'center',
    marginBottom: materialUILayout.horizontalSpace,
    marginTop: materialUILayout.highRowHeight,
  },
});
