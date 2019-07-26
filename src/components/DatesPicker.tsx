import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { DatePickerAndroid, StyleSheet } from 'react-native';
import Sentry from 'react-native-sentry';
import { Store } from '../lib/Store';
import { DateItem, Person, SelectedItem } from '../Types';
import ItemsPicker from './ItemsPicker';

interface Props {
  store?: Store;
  person: Person;
}

export default inject('store')(
  observer(
    class DatesPicker extends Component<Props> {
      public render() {
        return (
          <ItemsPicker
            title={'Dates'}
            selected={this.props.person.nonCall}
            onAdd={this.add}
            onRemove={this.removeDateItem}
          />
        );
      }

      private add = async (): Promise<void> => {
        try {
          const { action, year, month, day } = await DatePickerAndroid.open({
            date: new Date(),
          });

          if (action !== DatePickerAndroid.dismissedAction) {
            this.props.store!.update(this.props.person, {
              nonCall: [
                ...this.props.person.nonCall,
                new DateItem(year, month, day),
              ],
            });
          }
        } catch (ex) {
          Sentry.captureException(ex);
        }
      }

      private removeDateItem = (dateItem: SelectedItem): void => {
        const filtered = this.props.person.nonCall.filter(
          (c: DateItem) => c.valueOf().toString() !== dateItem.getId(),
        );

        this.props.store!.update(this.props.person, {
          nonCall: filtered,
        });
      }
    },
  ),
);
