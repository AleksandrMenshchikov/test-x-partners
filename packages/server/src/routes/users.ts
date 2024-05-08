import { Router } from 'express';
import { getUser, getUsers, signout, updateUser } from '../controllers/users';
import { validateUpdateUser } from '../validators/validateUpdateUser';
import { upload } from '../shared/multer';

export const usersRouter = Router();

usersRouter.get('/me', getUser);
usersRouter.get('/', getUsers);
usersRouter.patch(
  '/me',
  upload.single('image'),
  validateUpdateUser(),
  updateUser
);
usersRouter.post('/signout', signout);
