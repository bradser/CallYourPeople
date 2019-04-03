import React, { PureComponent } from 'react';
import { Linking, StyleSheet } from 'react-native';
import TouchableOpacityButton from './TouchableOpacityButton';

interface Props {
  url: string;
  text: string;
}

export default class Link extends PureComponent<Props> {
  public render() {
    return (
      <TouchableOpacityButton
        style={styles.style}
        text={this.props.text}
        onPress={() => Linking.openURL(this.props.url)}
      />
    );
  }
}

const styles = StyleSheet.create({
  style: { color: 'blue' },
});
