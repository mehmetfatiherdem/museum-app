import { Request } from 'express';
import mongoose, { Types } from 'mongoose';

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
  id: mongoose.Types.ObjectId; // MongoDB _id
  name: string;
  lastName: string;
  email: string;
  role: string;
}

export interface IGetUserAuthInfoRequest extends Request {
  user: IUser;
}

type userEndpointReturnValData = {
  name: string;
  lastName: string;
  email: string;
  role: string;
  favMuseums: [Types.ObjectId];
  comments: [Types.ObjectId];
};

export type userEndpointReturnVal = {
  message: string;
  data: userEndpointReturnValData;
};


