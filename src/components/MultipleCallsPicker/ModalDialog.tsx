import React, { Component } from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { Button, FAB, List, Modal, Portal, Text } from 'react-native-paper';
import { Call } from '../../Types';

interface Props {
  log: Call[];
  onSelect: (selected: Call) => void;
  children: any;
}

interface State {
  visible: boolean;
}

export default class ModalDialog extends Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  public render() {
    return (
      <View>
        <FAB small icon='add' onPress={this.open} />
        {this.props.children}
        <Portal>
          <Modal visible={this.state.visible}>
            <ScrollView>
              {this.props.log.map((call, index) => (
                <List.Item
                  key={index}
                  title={() => (
                    <TouchableOpacity onPress={() => this.selectCall(call)}>
                      <Text>{call.dateTime}</Text>
                      <Text>{call.duration}</Text>
                    </TouchableOpacity>
                  )}
                />
              ))}
            </ScrollView>
            <Button onPress={this.close}>Close</Button>
          </Modal>
        </Portal>
      </View>
    );
  }

  private selectCall = (call: Call): void => {
    this.props.onSelect(call);

    this.close();
  }

  private open = (): void => {
    this.setState({ visible: true });
  }

  private close = (): void => {
    this.setState({ visible: true });
  }
}
