import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, IconButton, Subheading } from 'react-native-paper';
import { cypGreen, materialUILayout } from '../lib/Constants';
import { SelectedItem } from '../Types';
import HelpDialog from './HelpDialog';

interface Props {
  title: string;
  selected: SelectedItem[];
  helpText: string;
  onAdd: () => void;
  onRemove: (removed: SelectedItem) => void;
}

export default class ItemsPicker extends Component<Props> {
  private helpDialog: HelpDialog | null = null;

  public render() {
    return (
      <View>
        <Subheading style={styles.title}>{this.props.title}</Subheading>
        <View style={styles.viewHorizontal}>
          <View>
            <FAB
              small
              icon='add'
              style={styles.fab}
              onPress={this.props.onAdd}
            />
            <IconButton onPress={this.openHelp} icon='help' size={24} />
          </View>
          <View style={styles.viewFullWidth}>
            {this.props.selected.map((item, index) => (
              <View key={index} style={styles.itemView}>
                <Subheading>{item.getLabel()}</Subheading>
                <IconButton
                  onPress={() => this.props.onRemove(item)}
                  icon='delete'
                  size={20}
                />
              </View>
            ))}
          </View>
        </View>
        <HelpDialog text={this.props.helpText} ref={this.setHelpDialogRef} />
      </View>
    );
  }

  private openHelp = (): void => {
    this.helpDialog!.open();
  }

  private setHelpDialogRef = (md: HelpDialog): void => {
    this.helpDialog = md;
  }
}

const styles = StyleSheet.create({
  fab: {
    backgroundColor: cypGreen,
    height: 40,
    marginLeft: materialUILayout.smallSpace,
    marginRight: materialUILayout.margin,
    marginTop: materialUILayout.smallSpace,
    width: 40,
  },
  help: {
    marginTop: materialUILayout.smallSpace,
  },
  itemView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    marginLeft: materialUILayout.smallSpace,
  },
  viewFullWidth: {
    flex: 1,
  },
  viewHorizontal: {
    flexDirection: 'row',
  },
});
