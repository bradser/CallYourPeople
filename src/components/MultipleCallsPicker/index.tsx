import React, { Component } from 'react';
import { TouchableOpacity } from 'react-native';
import { List } from 'react-native-paper';
import { Call } from '../../Types';
import ModalDialog from './ModalDialog';

interface Props {
  title: string;
  log: Call[];
  selected: Call[];
  onSelect: (newSelected: Call[]) => void;
}

export default class MultpleCallsPicker extends Component<Props> {
  public render() {
    return (
      <List.Section title={this.props.title}>
        <ModalDialog log={this.props.log} onSelect={this.selectCall}>
          {this.props.selected.map((call, index) => (
            <List.Item
              key={index}
              title={call.dateTime}
              right={() => (
                <TouchableOpacity onPress={() => this.removeCall(call)}>
                  <List.Icon icon='delete' color='black' />
                </TouchableOpacity>
              )}
            />
          ))}
        </ModalDialog>
      </List.Section>
    );
  }

  private selectCall = (call: Call): void => {
    this.props.onSelect(this.props.selected.concat(call));
  }

  private removeCall = (call: Call): void => {
    this.props.onSelect(
      this.props.selected.filter((c) => c.timestamp === call.timestamp),
    );
  }
}
