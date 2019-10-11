import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { PeopleStore } from '../lib/store/People';
import { Call, Person } from '../Types';
import CallsPicker from './CallsPicker';

interface Props {
  peopleStore?: PeopleStore;
  log: Call[];
  person: Person;
}

export default inject('peopleStore')(
  observer(
    class RemoveCallsPicker extends Component<Props> {
      public render() {
        return (
          <CallsPicker
            title='Remove Calls'
            helpText="Remove calls from a contact's shared phone number. For example, if you call your parent's home number, which is set in both your father's and mother's contacts, yet you only speak to one of them."
            log={this.props.log}
            selected={this.props.person.removed}
            filter={this.filter}
            onSelect={this.removeCalls}
          />
        );
      }

      private filter = (value: Call): boolean =>
        !!this.props.person.contact.phones.find(
          (phone) => phone.number === value.phoneNumber,
        )

      private removeCalls = (newSelected: Call[]): void =>
        this.props.peopleStore!.update(this.props.person, {
          removed: newSelected,
        })
    },
  ),
);
