import { statusCode } from '../shared/constants';

export class NotFound extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.NOT_FOUND;
  }
}
