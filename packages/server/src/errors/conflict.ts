import { statusCode } from '../shared/constants';

export class Conflict extends Error {
  readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.statusCode = statusCode.CONFLICT;
  }
}
