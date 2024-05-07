import { Schema } from 'mongoose';

export type TPayload = {
  _id: Schema.Types.ObjectId;
  iat: number;
};

export type TUser = {
  name?: string | undefined;
  email: string;
  password: string;
  birthDate?: Date | undefined;
  gender?: string | undefined;
  image?: string | undefined;
};
