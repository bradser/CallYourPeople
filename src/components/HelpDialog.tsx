import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { Text } from 'react-native-paper';
import { materialUILayout } from '../lib/Constants';

interface Props {
  text: string;
}

interface State {
  visible: boolean;
}

export default class HelpDialog extends Component<Props, State> {
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
          <Text style={styles.text}>{this.props.text}</Text>
          <Button style={styles.button} onPress={this.close}>Close</Button>
        </Modal>
      </Portal>
    );
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
    marginVertical: materialUILayout.margin * 2,
    padding: materialUILayout.margin,
  },
  text: {
    fontSize: materialUILayout.margin,
  },
});
