import AsyncStorage from '@react-native-community/async-storage';
import { runInAction } from 'mobx';
import { Contact } from 'react-native-select-contact';

export interface RemindContactsStore {
  remindContacts: Contact[];
}

export class RemindContactsStoreImpl implements RemindContactsStore {
  private static storageKey = 'remindContacts';

  private _remindContacts: Contact[] = [];

  constructor() {
    AsyncStorage.getItem(RemindContactsStoreImpl.storageKey).then((data) => {
      if (data) {
        runInAction(() => {
          this._remindContacts = JSON.parse(data);
        });
      }
    });
  }

  public get remindContacts(): Contact[] {
    return this._remindContacts;
  }

  public set remindContacts(remind: Contact[]) {
    this._remindContacts = remind;

    AsyncStorage.setItem(
      RemindContactsStoreImpl.storageKey,
      JSON.stringify(this._remindContacts),
    );
  }
}
