import React, { PureComponent } from 'react';
import { View, ViewStyle } from 'react-native';
import { Button, Menu, Text } from 'react-native-paper';
import { FrequencyText, Person } from '../Types';

interface Props {
  person: Person;
  onSelect: (index: number) => void;
  style?: ViewStyle;
}

interface State {
  visible: boolean;
}

export default class FrequencyPicker extends PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  public render() {
    return (
      <Menu
        visible={this.state.visible}
        onDismiss={this.closeMenu}
        anchor={
          <View
            style={
              {
                // flex: 1,
                // flexDirection: 'row',
                //width: 400
              }
            }
          >
            <Text>Frequency:</Text>
            <Button mode='outlined' onPress={this.openMenu}
            style={{width: 110}}>
              {FrequencyText[this.props.person.frequency]}
            </Button>
          </View>
        }
      >
        {FrequencyText.map((frequencyText, index) => (
          <Menu.Item
            key={index}
            title={frequencyText}
            onPress={() => this.select(index)}
          />
        ))}
      </Menu>
    );
  }

  private openMenu = () => this.setState({ visible: true });

  private closeMenu = () => this.setState({ visible: false });

  private select = (index: number): void => {
    this.props.onSelect(index);

    this.closeMenu();
  }
}
