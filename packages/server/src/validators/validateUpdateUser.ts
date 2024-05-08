import { celebrate } from 'celebrate';
import Joi from 'joi';

export function validateUpdateUser() {
  return celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(1).max(250).trim(),
      password: Joi.string().min(4).max(250).trim(),
      image: Joi.string().trim(),
    }),
  });
}
