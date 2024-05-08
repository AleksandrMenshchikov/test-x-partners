import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import { DATA, JWT, responseText, statusCode } from '../shared/constants';
import { TUser } from '../shared/types';
import { Conflict } from '../errors/conflict';
import { Unauthorized } from '../errors/unauthorized';
import { NotFound } from '../errors/notFound';

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { email, password, ...rest }: TUser = req.body;

    const response = await User.findOne({ email });

    if (response) {
      throw new Conflict(
        responseText[
          'При регистрации указан email, который уже существует на сервере'
        ]
      );
    }

    const hash = await bcrypt.hash(password, 10);

    const data = await User.create({
      ...rest,
      image: req.file ? req.file.filename : 'plug.jpeg',
      email,
      password: hash,
    });

    const { password: p, ...rest1 } = data.toJSON();

    const token = jwt.sign({ _id: data._id }, process.env.JWT_SECRET as string);

    res
      .cookie(JWT, token, {
        maxAge: 3600000 * 24 * 12, // 1 час * 24 * 12
        httpOnly: true,
        sameSite: true,
      })
      .status(statusCode.CREATED)
      .send({ [DATA]: rest1 });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password }: TUser = req.body;

    const data = await User.findOne({ email }).select('+password');

    if (!data) {
      throw new Unauthorized(
        responseText[
          'При авторизации указан email, который не существует на сервере'
        ]
      );
    } else {
      const matched = await bcrypt.compare(password, data.password);

      if (matched) {
        const { password: p, ...rest } = data.toJSON();

        const token = jwt.sign(
          { _id: data._id },
          process.env.JWT_SECRET as string
        );

        res
          .cookie(JWT, token, {
            maxAge: 3600000 * 24 * 12, // 1 час * 24 * 12
            httpOnly: true,
            sameSite: true,
          })
          .status(statusCode.OK)
          .send({ [DATA]: rest });
      } else {
        throw new Unauthorized(responseText['Передан неверный пароль']);
      }
    }
  } catch (err) {
    next(err);
  }
}

export async function getUser(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    throw new Unauthorized('Необходима авторизация');
  }

  try {
    const data = await User.findById(req.user._id);

    if (!data) {
      throw new NotFound(
        responseText['Пользователь по указанному _id не найден']
      );
    } else {
      res.status(statusCode.OK).send({ [DATA]: data });
    }
  } catch (err) {
    next(err);
  }
}

export async function updateUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new Unauthorized('Необходима авторизация');
  }

  try {
    const { _id } = req.user;
    const { name, password }: TUser = req.body;

    let data: unknown;

    if (password) {
      const hash = await bcrypt.hash(password, 10);
      data = await User.findByIdAndUpdate(
        _id,
        {
          password: hash,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (req.file) {
      data = await User.findByIdAndUpdate(
        _id,
        {
          image: req.file.filename,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (name) {
      data = await User.findByIdAndUpdate(
        _id,
        {
          name,
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }

    if (!data) {
      throw new NotFound(
        responseText['Пользователь по указанному _id не найден']
      );
    } else {
      res.status(statusCode.OK).send({ [DATA]: data });
    }
  } catch (err) {
    next(err);
  }
}

export async function getUsers(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    throw new Unauthorized('Необходима авторизация');
  }

  try {
    const data = await User.find({ _id: { $ne: req.user._id } });
    res.status(statusCode.OK).send({ [DATA]: data });
  } catch (err) {
    next(err);
  }
}

export function signout(_: Request, res: Response): void {
  res
    .clearCookie('jwt')
    .status(statusCode.OK)
    .json({ [DATA]: 'ok' });
}
