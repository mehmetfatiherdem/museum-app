import { Request } from 'express';

export const DAY_NAMES = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayNames = typeof DAY_NAMES[number];

export type WorkingTimes = {
  [key in DayNames]: {
    opening: string;
    closing: string;
  } | null;
};

type userLoginReturnValData = {
  name: string;
  lastName: string;
  email: string;
};

export type userLoginReturnVal = {
  message: string;
  data: userLoginReturnValData;
};

interface IUser {
  id: string; // MongoDB _id
  name: string;
  lastName: string;
  email: string;
  role: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}
