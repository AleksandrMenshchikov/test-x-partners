import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { MulterError } from 'multer';
import { MESSAGE, responseText, statusCode } from '../shared/constants';

export function handleErrors(
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof MulterError) {
    res.status(statusCode.BAD_REQUEST).send({ [MESSAGE]: err.message });
  } else if (err instanceof mongoose.Error) {
    res.status(statusCode.BAD_REQUEST).send({ [MESSAGE]: err.message });
  } else if (err.code === 11000) {
    if (err.keyPattern.email) {
      res.status(statusCode.CONFLICT).send({ [MESSAGE]: err.message });
    } else {
      res.status(statusCode.BAD_REQUEST).send({ [MESSAGE]: err.message });
    }
  } else if (
    err.statusCode &&
    err.statusCode !== statusCode.INTERNAL_SERVER_ERROR
  ) {
    res.status(err.statusCode).send({ [MESSAGE]: err.message || err });
  } else {
    res
      .status(statusCode.INTERNAL_SERVER_ERROR)
      .send({ [MESSAGE]: responseText['На сервере произошла ошибка'] });
  }

  next();
}
