import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { Component } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, FAB, List, Modal, Portal } from 'react-native-paper';
import { cymGreen, materialUILayout } from '../../lib/Constants';
import { prettifyPhoneNumber } from '../../lib/Helpers';
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
  private phoneNumberUtil = PhoneNumberUtil.getInstance();

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
    };
  }

  public render() {
    return (
      <View style={styles.view}>
        <FAB small icon='add' style={styles.fab} onPress={this.open} />
        {this.props.children}
        <Portal>
          <Modal
            visible={this.state.visible}
            contentContainerStyle={styles.modal}
          >
            <ScrollView>
              {this.props.log.slice(0, 100).map((call, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.selectCall(call)}
                >
                  <List.Item
                    title={call.dateTime}
                    description={this.getListItemText(call)}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Button onPress={this.close}>Close</Button>
          </Modal>
        </Portal>
      </View>
    );
  }

  private getListItemText = (call: Call): string => {
    return `${call.name || prettifyPhoneNumber(
      this.phoneNumberUtil,
      call.phoneNumber,
    )} - ${Math.round(call.duration / 60).toString()} minutes`;
  }

  private selectCall = (call: Call): void => {
    this.props.onSelect(call);

    this.close();
  }

  private open = (): void => {
    this.setState({ visible: true });
  }

  private close = (): void => {
    this.setState({ visible: false });
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: cymGreen,
    height: 40,
    marginLeft: materialUILayout.smallSpace,
    marginRight: materialUILayout.margin,
    marginTop: materialUILayout.smallSpace,
    width: 40,
  },
  modal: {
    backgroundColor: 'white',
    marginHorizontal: materialUILayout.margin,
    marginVertical: materialUILayout.margin * 2,
  },
  view: {
    flexDirection: 'row',
  },
});
