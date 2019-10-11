import AsyncStorage from '@react-native-community/async-storage';
import { IObservableValue, observable, runInAction } from 'mobx';

export interface SettingsStore {
  isPremium: IObservableValue<boolean>;
  userIdAmazon: string;

  setIsPremium(isPremium: boolean): void;
}

export class SettingsStoreImpl implements SettingsStore {
  private static storageKey = 'remindContacts';

  public isPremium: IObservableValue<boolean> = observable.box(false);
  private _userIdAmazon: string = '';

  constructor() {
    AsyncStorage.getItem(SettingsStoreImpl.storageKey).then((data) => {
      if (data) {
        runInAction(() => {
          const settings = JSON.parse(data);

          this.isPremium = observable.box(settings._isPremium);
          this._userIdAmazon = settings._userIdAmazon;
        });
      }
    });
  }

  public setIsPremium = (isPremium: boolean): void => {
    this.isPremium.set(isPremium);

    this.save();
  }

  public get userIdAmazon(): string {
    return this._userIdAmazon;
  }

  public set userIdAmazon(userIdAmazon: string) {
    this._userIdAmazon = userIdAmazon;

    this.save();
  }

  private save = (): void => {
    AsyncStorage.setItem(SettingsStoreImpl.storageKey, JSON.stringify(this));
  }
}
