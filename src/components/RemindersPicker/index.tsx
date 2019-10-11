import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { View } from 'react-native';
import { defaultReminder } from '../../lib/Constants';
import { PeopleStore } from '../../lib/store/People';
import { CypRRule, Person, SelectedItem } from '../../Types';
import ItemsPicker from '../ItemsPicker';
import ModalDialog from './ModalDialog';

interface Props {
  peopleStore?: PeopleStore;
  person: Person;
}

export default inject('peopleStore')(
  observer(
    class RemindersPicker extends Component<Props> {
      private modalDialog: ModalDialog | null = null;

      public render() {
        const cypRRules = CypRRule.convertFromRRules(
          this.props.person.reminders,
        );

        return (
          <View>
            <ItemsPicker
              title={'Reminders'}
              helpText={'Choose specific days/times to be reminded.'}
              selected={cypRRules}
              onAdd={this.openDialog}
              onRemove={this.removeReminder}
            />
            <ModalDialog
              onSelect={this.addReminder}
              ref={this.setModalDialogRef}
            />
          </View>
        );
      }

      private openDialog = (): void => {
        this.modalDialog!.open();
      }

      private addReminder = (reminder: CypRRule): void => {
        const cypRRules = CypRRule.convertFromRRules(
          this.props.person.reminders,
        );

        this.updateStore(cypRRules.concat(reminder));
      }

      private removeReminder = (cypRRule: SelectedItem<CypRRule>): void => {
        const cypRRules = CypRRule.convertFromRRules(
          this.props.person.reminders,
        );

        this.updateStore(
          cypRRules.filter((c: CypRRule) => !cypRRule.isEqual(c)),
        );
      }

      private updateStore = (newSelected: CypRRule[]): void => {
        let reminders = CypRRule.convertToRRules(newSelected);

        if (reminders.length === 0) {
          reminders = defaultReminder;
        }

        this.props.peopleStore!.update(this.props.person, {
          reminders,
        });
      }

      private setModalDialogRef = (md: ModalDialog): void => {
        this.modalDialog = md;
      }
    },
  ),
);
