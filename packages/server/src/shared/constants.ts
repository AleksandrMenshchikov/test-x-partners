export const DATA = 'data' as const;
export const MESSAGE = 'message' as const;
export const JWT = 'jwt' as const;
export const MALE = 'male' as const;
export const FEMALE = 'female' as const;

export const statusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const responseText = {
  'Данный маршрут не существует': 'Данный маршрут не существует',
  'На сервере произошла ошибка': 'На сервере произошла ошибка',
  'При регистрации указан email, который уже существует на сервере':
    'При регистрации указан email, который уже существует на сервере',
  'При авторизации указан email, который не существует на сервере':
    'При авторизации указан email, который не существует на сервере',
  'Передан неверный пароль': 'Передан неверный пароль',
  'Пользователь по указанному _id не найден':
    'Пользователь по указанному _id не найден',
} as const;
