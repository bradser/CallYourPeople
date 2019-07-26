import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Call, SelectedItem } from '../../Types';
import ItemsPicker from '../ItemsPicker';
import ModalDialog from './ModalDialog';

interface Props {
  title: string;
  log: Call[];
  selected: Call[];
  filter?: (value: Call) => boolean;
  onSelect: (newSelected: Call[]) => void;
}

export default class CallsPicker extends Component<Props> {
  private modalDialog: ModalDialog | null = null;

  public render() {
    const filteredLog = this.filterCurrentSelectionsAddedRemoved();

    return (
      <View>
        <ItemsPicker
          title={this.props.title}
          selected={this.props.selected}
          onAdd={this.add}
          onRemove={this.removeCall}
        />
        <ModalDialog
          log={filteredLog}
          onSelect={this.selectCall}
          ref={this.setModalDialogRef}
        />
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

  private add = (): void => {
    this.modalDialog!.open();
  }

  private removeCall = (call: SelectedItem): void =>
    this.props.onSelect(
      this.props.selected.filter((c: Call) => c.getId() !== call.getId()),
    )

  private selectCall = (call: Call): void =>
    this.props.onSelect(this.props.selected.concat(call))

  private setModalDialogRef = (md: ModalDialog): void => {
    this.modalDialog = md;
  }
}
