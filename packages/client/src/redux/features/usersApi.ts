import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../shared/constants.ts';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createUser: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: `signup`,
        method: 'POST',
        credentials: 'include',
        body,
      }),
    }),
    login: builder.mutation<unknown, { email: string; password: string }>({
      query: (body) => ({
        url: `signin`,
        method: 'POST',
        credentials: 'include',
        body,
      }),
    }),
    getUser: builder.query<unknown, void>({
      query: () => ({
        url: `users/me`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
  }),
});

export const { useCreateUserMutation, useLoginMutation, useGetUserQuery } =
  usersApi;
