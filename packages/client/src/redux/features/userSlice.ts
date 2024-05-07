import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type TUser = {
  user: null | Record<string, null | string>;
};

const initialState: TUser = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<Record<string, null | string>>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export const userReducer = userSlice.reducer;
