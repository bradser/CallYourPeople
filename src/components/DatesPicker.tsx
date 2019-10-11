import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { DatePickerAndroid } from 'react-native';
import Sentry from 'react-native-sentry';
import Fremium from '../lib/Fremium';
import { PeopleStore } from '../lib/store/People';
import { SettingsStore } from '../lib/store/Settings';
import { DateItem, Person, SelectedItem } from '../Types';
import ItemsPicker from './ItemsPicker';

interface Props {
  peopleStore?: PeopleStore;
  settingsStore?: SettingsStore;
  person: Person;
}

export default inject('peopleStore', 'settingsStore')(
  observer(
    class DatesPicker extends Component<Props> {
      public render() {
        return (
          <ItemsPicker
            title='Dates'
            helpText='Add a date of a non-phone conversation. For example, if you talk to someone in person.'
            selected={this.props.person.nonCall}
            onAdd={this.fremiumAdd}
            onRemove={this.removeDateItem}
          />
        );
      }

      private fremiumAdd = async (): Promise<any> => {
        if (this.props.settingsStore!.isPremium.get()) {
          await this.add();
        } else {
          await new Fremium(this.props.peopleStore!, this.props.settingsStore!).upgrade();
        }
      }

      private add = async (): Promise<void> => {
        try {
          // @ts-ignore problem with types on DatePickerAndroid
          const { action, year, month, day } = await DatePickerAndroid.open({
            date: new Date(),
          });

          if (action !== DatePickerAndroid.dismissedAction) {
            this.props.peopleStore!.update(this.props.person, {
              nonCall: this.props.person.nonCall.concat(
                new DateItem(year, month, day),
              ),
            });
          }
        } catch (ex) {
          Sentry.captureException(ex);
        }
      }

      private removeDateItem = (dateItem: SelectedItem<DateItem>): void => {
        const filtered = this.props.person.nonCall.filter(
          (c: DateItem) => !dateItem.isEqual(c),
        );

        this.props.peopleStore!.update(this.props.person, {
          nonCall: filtered,
        });
      }
    },
  ),
);
