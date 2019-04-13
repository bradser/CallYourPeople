import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Subheading } from 'react-native-paper';
import { Call } from '../../Types';
import ModalDialog from './ModalDialog';

interface Props {
  title: string;
  log: Call[];
  selected: Call[];
  filter?: (value: Call) => boolean;
  onSelect: (newSelected: Call[]) => void;
}

export default class CallsPicker extends Component<Props> {
  // TODO filter out selected from log
  public render() {
    const filteredLog = this.filterCurrentSelectionsAddedRemoved();

    return (
      <View>
        <Subheading>{this.props.title}</Subheading>
        <ModalDialog log={filteredLog} onSelect={this.selectCall}>
          <View style={styles.view}>
            {this.props.selected.map((call, index) => (
              <View key={index} style={styles.itemView}>
                <Subheading>{call.dateTime}</Subheading>
                <IconButton
                  onPress={() => this.removeCall(call)}
                  icon='delete'
                  size={20}
                />
              </View>
            ))}
          </View>
        </ModalDialog>
      </View>
    );
  }

  private filterCurrentSelectionsAddedRemoved = (): Call[] => {
    const filteredCurrentSelections = this.props.log.filter(
      (c) => !this.props.selected.find((call) => call.timestamp === c.timestamp),
    );

    return this.props.filter
      ? filteredCurrentSelections.filter(this.props.filter)
      : filteredCurrentSelections;
  }

  private selectCall = (call: Call): void =>
    this.select(this.props.selected.concat(call))

  private removeCall = (call: Call): void =>
    this.select(
      this.props.selected.filter((c: Call) => c.timestamp !== call.timestamp),
    )

  private select = (newSelected: Call[]): void =>
    this.props.onSelect(newSelected)
}

const styles = StyleSheet.create({
  itemView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  view: {
    flex: 1,
    flexDirection: 'column',
  },
});
