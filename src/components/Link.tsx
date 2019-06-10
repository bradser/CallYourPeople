import React, { PureComponent } from 'react';
import { Linking, StyleSheet, TextStyle } from 'react-native';
import TouchableOpacityButton from './TouchableOpacityButton';

interface Props {
  url: string;
  text: string;
  style: TextStyle;
}

export default class Link extends PureComponent<Props> {
  public render() {
    return (
      <TouchableOpacityButton
        style={{ ...styles.style, ...this.props.style }}
        text={this.props.text}
        onPress={() => Linking.openURL(this.props.url)}
      />
    );
  }
}

export const contactLink = (recordId: string): Promise<any> => (
  Linking.openURL(
    `content://com.android.contacts/contacts/${
      recordId
    }`,
  )
);

const styles = StyleSheet.create({
  style: { color: 'blue' },
});
