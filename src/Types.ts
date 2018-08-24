
export interface Person {
    name: string;
    phoneNumber: string;
    lastCall: Date;
    frequency: Frequency;
}


export enum Frequency {
    twice_A_Week,
    once_A_Week,
    once_Every_Two_Weeks,
    once_Every_Three_Weeks,
    once_Every_Four_Weeks
}