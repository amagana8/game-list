export const usernameRegex = new RegExp(
  '^[a-zA-Z0-9]([._-](?![._-])|[a-zA-Z0-9]){0,28}[a-zA-Z0-9]$',
);
export const emailRegex = new RegExp(
  '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$',
);
export const passwordRegex = new RegExp('^\\S{8,256}$');
