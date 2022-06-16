import { sign } from 'jsonwebtoken';

export const createRefreshToken = (user: any) => {
  return sign(
    { sub: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_JWT_SECRET,
    { expiresIn: '7d' },
  );
};

export const createAccessToken = (user: any) => {
  return sign({ sub: user.id }, process.env.ACCESS_JWT_SECRET, {
    expiresIn: '15min',
  });
};
