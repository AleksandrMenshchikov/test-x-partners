import { celebrate } from 'celebrate';
import Joi from 'joi';
import { FEMALE, MALE } from '../shared/constants';

export function validateCreateUser() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(1).max(250).trim(),
      email: Joi.string().required().email().trim(),
      password: Joi.string().required().min(4).max(250).trim(),
      birthDate: Joi.date().iso(),
      gender: Joi.string().valid(MALE, FEMALE).trim(),
      image: Joi.string().trim(),
    }),
  });
}
