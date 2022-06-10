interface UserState {
  username: string;
  accessToken: string;
}

let user: UserState = { username: '', accessToken: '' };

export const setUser = (input: UserState) => {
  user = input;
};

export const getUser = () => {
  return user;
};
