import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../errors/unauthorized';
import { JWT } from '../shared/constants';
import { TPayload } from '../shared/types';

export function auth(req: Request, _res: Response, next: NextFunction) {
  const { cookie } = req.headers;

  const token = cookie
    ?.split('; ')
    .find((elem) => elem.includes(JWT))
    ?.split('=')[1];

  if (!token) {
    throw new Unauthorized('Необходима авторизация');
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET as string) as TPayload;
  } catch (err) {
    throw new Unauthorized('Необходима авторизация');
  }

  next();
}
