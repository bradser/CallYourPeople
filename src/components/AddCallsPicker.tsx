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
    class AddCallsPicker extends Component<Props> {
      public render() {
        return (
          <CallsPicker
            title='Add Calls'
            helpText="Add calls not associated with a contact's phone number. For example, if you talk to your friend contact on your sibling contact's phone."
            log={this.props.log}
            selected={this.props.person.added}
            filter={this.filter}
            onSelect={this.selectedCalls}
          />
        );
      }

      private filter = (value: Call): boolean =>
        !this.props.person.contact.phones.find(
          (phone) => phone.number === value.phoneNumber,
        )

      private selectedCalls = (newSelected: Call[]): void =>
        this.props.peopleStore!.update(this.props.person, {
          added: newSelected,
        })
    },
  ),
);
