import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string;
  token: string;
}

const initialState: UserState = {
  username: '',
  token: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<UserState>) => {
      state.username = action.payload.username;
      state.token = action.payload.token;
    },
    logout: () => {
      return initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
