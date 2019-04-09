import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';
import { Store } from '../lib/Store';
import { Call, Person } from '../Types';
import MultpleCallsPicker from './MultipleCallsPicker';

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
          <MultpleCallsPicker
            title='Add Calls'
            log={this.props.log}
            selected={this.props.person.added}
            onSelect={(newSelected) => {
              this.props.person.added = newSelected;
            }}
          />
        );
      }
    },
  ),
);
