import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Text, ToggleButton } from 'react-native-paper';
import { materialUILayout, weekdaysNarrowPlus } from '../../lib/Constants';

interface Props {
  dayIndexes: Set<number>;
  onSelect: (dayIndexes: Set<number>) => void;
}

export default class DaysPicker extends Component<Props> {
  public render() {
    return (
      <ToggleButton.Row onValueChange={this.onValueChange} style={styles.row}>
        {weekdaysNarrowPlus.map((day, index) =>
          this.getButton(index, day),
        )}
      </ToggleButton.Row>
    );
  }

  private getButton = (index: number, day: string): React.ReactNode => (
    <ToggleButton
      key={index}
      value={day}
      icon={this.getIcon(day)}
      status={this.getStatus(index)}
      onPress={this.press(index)}
    />
  )

  // State changes handled in this.press
  private onValueChange = (): void => { /* */ };

  private getIcon = (day: string) => (): React.ReactNode => <Text>{day}</Text>;

  private getStatus = (index: number): string =>
    this.props.dayIndexes.has(index) ? 'checked' : 'unchecked'

  private press = (index: number) => (): void => {
    if (this.getStatus(index) === 'checked') {
      this.props.dayIndexes.delete(index);
    } else {
      this.props.dayIndexes.add(index);
    }

    this.props.onSelect(this.props.dayIndexes);
  }
}

const styles = StyleSheet.create({
  row: {
    margin: materialUILayout.horizontalSpace,
    marginBottom: materialUILayout.margin,
  },
});
