import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Button, List, Modal, Portal } from 'react-native-paper';
import { materialUILayout } from '../../lib/Constants';
import Format from '../../lib/Format';
import { Call } from '../../Types';

interface Props {
  log: Call[];
  onSelect: (selected: Call) => void;
}

interface State {
  visible: boolean;
}

export default class ModalDialog extends Component<Props, State> {
  private format = new Format();

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  public open = (): void => {
    this.setState({ visible: true });
  }

  public render() {
    return (
      <Portal>
        <Modal
          visible={this.state.visible}
          contentContainerStyle={styles.modal}
        >
          <ScrollView>
            {this.props.log.slice(0, 100).map((call, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => this.selectCall(call)}
              >
                <List.Item
                  title={call.dateTime}
                  description={this.getListItemText(call)}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Button style={styles.button} onPress={this.close}>
            Close
          </Button>
        </Modal>
      </Portal>
    );
  }

  private getListItemText = (call: Call): string => {
    return `${call.name ||
      this.format.prettifyPhoneNumber(call.phoneNumber)} - ${Math.round(
      call.duration / 60,
    ).toString()} minutes`;
  }

  private selectCall = (call: Call): void => {
    this.props.onSelect(call);

    this.close();
  }

  private close = (): void => {
    this.setState({ visible: false });
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: materialUILayout.margin,
  },
  modal: {
    backgroundColor: 'white',
    marginHorizontal: materialUILayout.margin,
    marginVertical: materialUILayout.highRowHeight,
    padding: materialUILayout.margin,
  },
});
