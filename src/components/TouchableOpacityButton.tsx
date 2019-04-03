import React, { PureComponent } from 'react';
import { Text, TextStyle, TouchableOpacity } from 'react-native';

interface Props {
  onPress: () => void;
  style?: TextStyle;
  text: string;
}

export default class TouchableOpacityButton extends PureComponent<Props> {
  public render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text style={this.props.style}>{this.props.text}</Text>
      </TouchableOpacity>
    );
  }
}
