import React, { PureComponent } from 'react';
import { FlexStyle, Linking, StyleProp, StyleSheet } from 'react-native';
import TouchableOpacityButton from './TouchableOpacityButton';

interface Props {
  url: string;
  text: string;
  style: StyleProp<FlexStyle>;
}

export default class Link extends PureComponent<Props> {
  public render() {
    return (
      <TouchableOpacityButton
        style={[styles.style, this.props.style]}
        text={this.props.text}
        onPress={this.press}
      />
    );
  }

  private press = (): void => {
    Linking.openURL(this.props.url);
  }
}

export const launchContact = (recordId: string): Promise<any> =>
  Linking.openURL(`content://com.android.contacts/contacts/${recordId}`);

const styles = StyleSheet.create({
  style: { color: 'blue' },
});
