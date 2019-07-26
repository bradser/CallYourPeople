import AsyncStorage from '@react-native-community/async-storage';
import { IObservableArray, observable, runInAction } from 'mobx';
import Sentry from 'react-native-sentry';
import { Call, DateItem, Person } from '../Types';

export class Store {
  public people = (observable([]) as unknown) as IObservableArray<Person>;

  constructor() {
    AsyncStorage.getItem('store').then((data) => {
      if (data) {
        runInAction(() => {
          this.people.replace(
            JSON.parse(data, (key, value) => {
              if (key === 'nonCall') {
                return value.map((item: string) => new DateItem(item));
              }

              if (key === 'added' || key === 'removed') {
                return value.map((item: Call) => {
                  const call = new Call(
                    item.dateTime,
                    item.duration,
                    item.name,
                    item.phoneNumber,
                    item.rawType,
                    item.timestamp,
                    item.type,
                  );

                  return call;
                });
              }

              return value;
            }),
          );
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
      } else {
        Sentry.captureMessage('remove: person not found');
      }
    });
  }

  public find = (personName: string): Person | undefined =>
    this.people.find((p) => p.contact.name === personName)

  public findIndex = (person: Person): number =>
    this.people.findIndex((p) => p.contact.name === person.contact.name)

  public update = (person: Person, properties: object): void => {
    runInAction(() => {
      const index = this.findIndex(person);

      if (index !== -1) {
        Object.assign(this.people[index], properties);

        this.save();
      } else {
        Sentry.captureMessage('update: person not found');
      }
    });
  }

  private save = (): void => {
    AsyncStorage.setItem('store', JSON.stringify(this.people.toJS()));
  }
}
