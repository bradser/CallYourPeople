import React, { PureComponent } from 'react';
import { Text, View, ViewStyle } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import * as MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FrequencyText, Person } from '../Types';

interface Props {
  person: Person;
  onSelect: (person: Person, index: number) => void;
  styles: ViewStyle;
}

export default class FrequencyPicker extends PureComponent<Props> {
  public render() {
    return (
      <Menu>
        <MenuTrigger>
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
              ...this.props.styles,
            }}
          >
            <Text>{FrequencyText[this.props.person.frequency]}</Text>
            <MaterialCommunityIcon.default name='dots-vertical' size={24} />
          </View>
        </MenuTrigger>
        <MenuOptions>
          {FrequencyText.map((frequencyText, index) => (
            <MenuOption
              key={index}
              value={index}
              text={frequencyText}
              onSelect={() => this.props.onSelect(this.props.person, index)}
            />
          ))}
        </MenuOptions>
      </Menu>
    );
  }
}
