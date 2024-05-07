import { Router } from 'express';
import { notFoundRouter } from './notFoundRouter';
import { usersRouter } from './users';

export const router = Router();

router.use('/users', usersRouter);
router.use('/*', notFoundRouter);
