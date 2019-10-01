import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { WheelPicker } from 'react-native-wheel-picker-android';
import { hours, materialUILayout } from '../../lib/Constants';
import { CypRRule } from '../../Types';
import DaysPicker from './DaysPicker';

interface Props {
  onSelect: (reminder: CypRRule) => void;
}

interface State {
  visible: boolean;
  cypRRule: CypRRule;
}

export default class ModalDialog extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      cypRRule: new CypRRule(),
      visible: false,
    };
  }

  public open = (): void => {
    this.setState({ cypRRule: new CypRRule(), visible: true });
  }

  public render() {
    return (
      <Portal>
        <Modal
          visible={this.state.visible}
          contentContainerStyle={styles.modal}
        >
          <DaysPicker
            dayIndexes={new Set<number>(this.state.cypRRule.days)}
            onSelect={this.selectDays}
          />
          <WheelPicker
            data={hours}
            selectedItem={this.state.cypRRule.hour}
            onItemSelected={this.selectHour}
          />
          <Button onPress={this.close} style={styles.button}>Close</Button>
        </Modal>
      </Portal>
    );
  }

  private selectDays = (days: Set<number>): void => {
    this.setState((prevState) => ({
      cypRRule: new CypRRule(days, prevState.cypRRule.hour),
    }));
  }

  private selectHour = (hour: number): void => {
    this.setState((prevState) => ({
      cypRRule: new CypRRule(prevState.cypRRule.days, hour),
    }));
  }

  private close = (): void => {
    if (this.state.cypRRule.days.size > 0) {
      this.props.onSelect(this.state.cypRRule);
    }

    this.setState({ visible: false });
  }
}

const styles = StyleSheet.create({
  button: {
    alignSelf: 'stretch',
  },
  modal: {
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: materialUILayout.margin,
    padding: materialUILayout.margin,
  },
  wheel: {
    marginTop: materialUILayout.margin,
  },
});
