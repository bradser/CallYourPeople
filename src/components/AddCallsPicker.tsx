import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Store } from '../lib/Store';
import { Call, Person } from '../Types';
import CallsPicker from './CallsPicker';

interface Props {
  store?: Store;
  log: Call[];
  person: Person;
}

export default inject('store')(
  observer(
    class AddCallsPicker extends Component<Props> {
      public render() {
        return (
          <CallsPicker
            title='Add Calls'
            log={this.props.log}
            selected={this.props.person.added}
            filter={this.filter}
            onSelect={this.addCalls}
          />
        );
      }

      private filter = (value: Call): boolean =>
          !this.props.person.contact.phones.find(
            (phone) => phone.number === value.phoneNumber,
          )

      private addCalls = (newSelected: Call[]): void =>
        this.props.store!.update(this.props.person, {
          added: newSelected,
        })
    },
  ),
);
