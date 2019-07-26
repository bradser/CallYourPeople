import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { DataTable } from 'react-native-paper';
import { NavigationInjectedProps, ScrollView } from 'react-navigation';
import { Store } from '../lib/Store';
import {
  Call,
  DetailsNavigationProps,
  FrequencyText,
  ViewPerson
} from '../Types';
import { materialUILayout } from './../lib/Constants';

interface Props extends NavigationInjectedProps {
  store?: Store;
  daysLabel: string;
  viewPeople: ViewPerson[];
  log: Call[];
}

export default inject('store')(
  observer(
    class Table extends Component<Props> {
      constructor(props: Props) {
        super(props);
      }

      public render() {
        return (
          <ScrollView>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={styles.cellName}>Name</DataTable.Title>
                <DataTable.Title numeric style={styles.cellDaysLeft}>
                  {this.props.daysLabel}
                </DataTable.Title>
                <DataTable.Title numeric>Frequency</DataTable.Title>
              </DataTable.Header>
              {this.getRows()}
            </DataTable>
          </ScrollView>
        );
      }

      private getRows = () =>
        this.props.viewPeople.map((person, index) => (
          <DataTable.Row
            key={index}
            onPress={() =>
              this.props.navigation.navigate(
                'Details',
                new DetailsNavigationProps(this.props.log, person.contact)
              )
            }
          >
            <DataTable.Cell style={styles.cellName}>
              {person.contact.name}
            </DataTable.Cell>
            <DataTable.Cell numeric style={styles.cellDaysLeft}>
              {Math.abs(person.daysLeftTillCallNeeded).toString()}
            </DataTable.Cell>
            <DataTable.Cell numeric>
              {FrequencyText[person.frequency]}
            </DataTable.Cell>
          </DataTable.Row>
        ));
    }
  )
);

const styles = StyleSheet.create({
  cellDaysLeft: { paddingRight: materialUILayout.horizontalSpace },
  cellName: { flex: 2.4, paddingRight: materialUILayout.horizontalSpace },
  scrollView: { margin: materialUILayout.margin }
});
