import { Schema, model } from 'mongoose';
import { isDate, isEmail } from 'validator';
import { TUser } from '../shared/types';
import { FEMALE, MALE } from '../shared/constants';

const userSchema = new Schema<TUser>(
  {
    name: {
      type: String,
      maxlength: [250, 'Поле "name" должно быть меньше 251 символа'],
      default: null,
    },
    email: {
      type: String,
      unique: true,
      index: true,
      required: [true, 'Поле "email" обязательное для заполнения'],
      validate: {
        validator: (v: string) => isEmail(v),
        message: 'Поле "email" не соответствует формату email',
      },
    },
    password: {
      type: String,
      select: false,
      required: [true, 'Поле "password" обязательное для заполнения'],
      minlength: [4, 'Поле "password" должно быть больше 3 символов'],
      maxlength: [250, 'Поле "password" должно быть меньше 251 символа'],
    },
    birthDate: {
      type: Date,
      validate: {
        validator: (v: string) => {
          if (v) {
            return isDate(v);
          }
          return true;
        },
        message: 'Поле "birthDate" не соответствует формату date',
      },
      default: null,
    },
    gender: {
      type: String,
      enum: [MALE, FEMALE, ''],
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const User = model<TUser>('user', userSchema, 'users');
