import { UserState } from '@utils/types';

let user: UserState = { username: '', accessToken: '' };

export const setUser = (input: UserState) => {
  user = input;
};

export const getUser = () => {
  return user;
};

export const getAccessToken = () => {
  return user.accessToken;
}

export const setAccessToken = (input: string) => {
  user.accessToken = input;
}
