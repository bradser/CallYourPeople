import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Subheading } from 'react-native-paper';
import { materialUILayout } from '../lib/Constants';
import { FrequencyText, Person } from '../Types';

interface Props {
  person: Person;
  onSelect: (index: number) => void;
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
      <View style={styles.view}>
        <Subheading style={styles.label}>Frequency:</Subheading>
        <Menu
          visible={this.state.visible}
          onDismiss={this.closeMenu}
          anchor={
            <Button mode='outlined' color='black' onPress={this.openMenu}>
              {FrequencyText[this.props.person.frequency]}
            </Button>
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
      </View>
    );
  }

  private openMenu = () => this.setState({ visible: true });

  private closeMenu = () => this.setState({ visible: false });

  private select = (index: number): void => {
    this.props.onSelect(index);

    this.closeMenu();
  }
}

const styles = StyleSheet.create({
  label: { marginRight: materialUILayout.horizontalSpace },
  view: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
