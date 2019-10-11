import AsyncStorage from '@react-native-community/async-storage';
import { IObservableArray, observable, runInAction } from 'mobx';
import Sentry, { SentrySeverity } from 'react-native-sentry';
import RRule from 'rrule';
import { Call, DateItem, Person } from '../../Types';
import { defaultReminder } from './../Constants';

export interface PeopleStore {
  people: IObservableArray<Person>;
  add(person: Person): void;
  remove(person: Person): void;
  find(personName: string): Person | undefined;
  findIndex(person: Person): number;
  update(person: Person, properties: object): void;
}

export class PeopleStoreImpl implements PeopleStore {
  private static storageKey = 'people';

  public people = (observable([]) as unknown) as IObservableArray<Person>;

  constructor() {
    AsyncStorage.getItem(PeopleStoreImpl.storageKey).then((data) => {
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

              if (key === 'reminders') {
                const reminders = value.map(
                  (item) => new RRule(item.origOptions),
                );

                return reminders;
              }

              return value;
            }),
          );

          // TODO: remove default initialization eventually
          this.people.forEach((person) => {
            if (!person.reminders || person.reminders.length === 0) {
              person.reminders = observable(defaultReminder);
            }
          });
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
        Sentry.captureBreadcrumb({
          category: 'Store',
          level: SentrySeverity.Error,
          message: 'remove: person not found',
        });
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
        Sentry.captureBreadcrumb({
          category: 'Store',
          level: SentrySeverity.Error,
          message: 'update: person not found',
        });
      }
    });
  }

  private save = (): void => {
    AsyncStorage.setItem(PeopleStoreImpl.storageKey, JSON.stringify(this.people));
  }
}
