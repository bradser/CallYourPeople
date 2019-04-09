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
    class RemoveCallsPicker extends Component<Props> {
      public render() {
        return (
          <MultpleCallsPicker
            title='Remove Calls'
            log={this.props.log}
            selected={this.props.person.removed}
            onSelect={(newSelected) => {
              this.props.person.removed = newSelected;
            }}
          />
        );
      }
    },
  ),
);
