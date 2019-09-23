import React, { PureComponent } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Menu, Subheading } from 'react-native-paper';
import { materialUILayout } from '../lib/Constants';
import { FrequencyMap, Person } from '../Types';

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
              {FrequencyMap.get(this.props.person.frequency)!.text}
            </Button>
          }
        >
          {Array.from(FrequencyMap, (entry, index) => (
            <Menu.Item
              key={index}
              title={entry[1].text}
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
