import { observable } from 'mobx';
import { Person } from '../Types';

export class Store {
  public people: Person[] = observable([]);

  public add = (person: Person): void => {
    // TODO: if already there, don't re-add
    this.people.push(person);
  }

  public remove = (person: Person): void => {
    // TODO: find based on name
    this.people.splice(this.people.indexOf(person), 1);
  }
}
