import { Router } from 'express';
import { getUser } from '../controllers/users';

export const usersRouter = Router();

usersRouter.get('/me', getUser);
