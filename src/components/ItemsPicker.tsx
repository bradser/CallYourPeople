import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { FAB, IconButton, Subheading } from 'react-native-paper';
import { cypGreen, materialUILayout } from '../lib/Constants';
import { SelectedItem } from '../Types';

interface Props {
  title: string;
  selected: SelectedItem[];
  onAdd: () => void;
  onRemove: (removed: SelectedItem) => void;
}

export default class ItemsPicker extends Component<Props> {
  public render() {
    return (
      <View>
        <Subheading>{this.props.title}</Subheading>
        <View style={styles.viewHorizontal}>
          <FAB small icon='add' style={styles.fab} onPress={this.props.onAdd} />
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
      </View>
    );
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
  itemView: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewFullWidth: {
    flex: 1,
  },
  viewHorizontal: {
    flexDirection: 'row',
  },
});
