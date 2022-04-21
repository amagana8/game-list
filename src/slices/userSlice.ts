import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  username: string;
}

const initialState: UserState = {
  username: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.username = action.payload;
    },
    logout: (state) => {
      state = initialState;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
