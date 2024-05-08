import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../shared/constants.ts';

export const usersApi = createApi({
  reducerPath: 'usersApi',
  tagTypes: ['User', 'Users'],
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    createUser: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: `signup`,
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    login: builder.mutation<unknown, { email: string; password: string }>({
      query: (body) => ({
        url: `signin`,
        method: 'POST',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['Users'],
    }),
    signout: builder.mutation<unknown, void>({
      query: () => ({
        url: `users/signout`,
        method: 'POST',
        credentials: 'include',
      }),
      invalidatesTags: ['User'],
    }),
    getUser: builder.query<unknown, void>({
      query: () => ({
        url: `users/me`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['User'],
    }),
    getUsers: builder.query<{ data: unknown }, void>({
      query: () => ({
        url: `users`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Users'],
    }),
    updateUser: builder.mutation<unknown, FormData>({
      query: (body) => ({
        url: `users/me`,
        method: 'PATCH',
        credentials: 'include',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useLoginMutation,
  useGetUserQuery,
  useUpdateUserMutation,
  useSignoutMutation,
  useGetUsersQuery,
} = usersApi;
