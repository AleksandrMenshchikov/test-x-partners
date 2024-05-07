import { TPayload } from '../../types';

declare global {
  namespace Express {
    interface Request {
      user?: TPayload;
    }
  }
}
