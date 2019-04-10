import AsyncStorage from '@react-native-community/async-storage';
import { IObservableArray, observable, runInAction } from 'mobx';
import { Person } from '../Types';

export class Store {
  public people = (observable([]) as unknown) as IObservableArray<Person>;

  constructor() {
    AsyncStorage.getItem('store').then((data) => {
      if (data) {
        runInAction(() => {
          this.people.replace(JSON.parse(data));
        });
      }
    });
  }

  public add = (person: Person): void => {
    runInAction(() => {
      const index = this.findIndex(person);

      if (index === -1) {
        this.people.push(person);

        this.save();
      }
    });
  }

  public remove = (person: Person): void => {
    runInAction(() => {
      const index = this.findIndex(person);

      if (index !== -1) {
        this.people.splice(index, 1);

        this.save();
      }
    });
  }

  public findIndex = (person: Person): number => {
    return this.people.findIndex((p) => p.contact.name === person.contact.name);
  }

  public setFrequency = (person: Person, frequency: number): void => {
    runInAction(() => {
      const index = this.findIndex(person);

      this.people[index].frequency = frequency;

      this.save();
    });
  }

  private save = (): void => {
    AsyncStorage.setItem('store', JSON.stringify(this.people.toJS()));
  }
}
