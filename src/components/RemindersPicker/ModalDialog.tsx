import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Button, Modal, Portal } from 'react-native-paper';
import { cypGreen, materialUILayout } from '../../lib/Constants';
import { CypRRule } from '../../Types';
import CypMenu from '../CypMenu';
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
      cypRRule: new CypRRule(new Set<number>(), 0),
      visible: false,
    };
  }

  public open = (): void => {
    this.setState({ cypRRule: new CypRRule(new Set<number>(), 0), visible: true });
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
          <CypMenu
            title={'Hour:'}
            labels={[
              '12 am',
              '1 am',
              '2 am',
              '3 am',
              '4 am',
              '5 am',
              '6 am',
              '7 am',
              '8 am',
              '9 am',
              '10 am',
              '11 am',
              '12 pm',
              '1 pm',
              '2 pm',
              '3 pm',
              '4 pm',
              '5 pm',
              '6 pm',
              '7 pm',
              '8 pm',
              '9 pm',
              '10 pm',
              '11 pm',
            ]}
            selectedIndex={this.state.cypRRule.hour}
            onSelect={this.selectHour}
          />

          <Button onPress={this.close}>Close</Button>
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
    this.setState({ visible: false });

    this.props.onSelect(this.state.cypRRule);
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: cypGreen,
    height: 40,
    marginLeft: materialUILayout.smallSpace,
    marginRight: materialUILayout.margin,
    marginTop: materialUILayout.smallSpace,
    width: 40,
  },
  modal: {
    backgroundColor: 'white',
    marginHorizontal: materialUILayout.margin,
    marginVertical: materialUILayout.margin * 2,
  },
});
