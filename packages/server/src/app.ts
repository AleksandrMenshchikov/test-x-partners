import 'dotenv/config';
import express, { json, urlencoded } from 'express';
import mongoose from 'mongoose';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import limiter from './shared/expressRateLimit';
import cors from './shared/cors';
import { router } from './routes';
import { handleErrors } from './controllers/errors';
import { auth } from './middlewares/auth';
import { errorLogger, requestLogger } from './middlewares/logger';
import { validateAuth } from './validators/validateAuth';
import { createUser, login } from './controllers/users';
import { validateCreateUser } from './validators/validateCreateUser';
import { upload } from './shared/multer';
import { validateLogin } from './validators/validateLogin';
import * as path from 'node:path';

mongoose
  .connect(process.env.DB_URI as string)
  .then(() => console.log('Mongoose connected to database'))
  .catch((error) => console.log(error));

const app = express();
app.use(helmet());
app.use(limiter);
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors);

app.use(requestLogger);
app.post('/signup', upload.single('image'), validateCreateUser(), createUser);
app.post('/signin', validateLogin(), login);
app.use(validateAuth(), auth);
app.use(
  '/',
  (_req, res, next) => {
    res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'public'))
);
app.use(router);
app.use(errorLogger);

app.use(errors());
app.use(handleErrors);

const { PORT = 4000 } = process.env;
app.listen(PORT, () => {
  console.log(`ExpressServer started on http://localhost:${PORT}`);
});
