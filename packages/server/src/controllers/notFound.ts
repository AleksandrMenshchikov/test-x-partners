import { NextFunction, Request, Response } from 'express';
import { NotFound } from '../errors/notFound';
import { responseText } from '../shared/constants';

export function handleNotFound(
  _req: Request,
  _res: Response,
  next: NextFunction
) {
  next(new NotFound(responseText['Данный маршрут не существует']));
}
