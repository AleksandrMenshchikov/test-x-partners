import { statusCode } from '../shared/constants';

export class Unauthorized extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.UNAUTHORIZED;
  }
}
