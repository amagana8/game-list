import { NextApiResponse } from 'next';

export const sendRefreshToken = (res: NextApiResponse, token: string) => {
  res.setHeader('Set-Cookie', [
    `refreshToken=${token}; Max-Age=${60 * 60 * 24 * 7}; Path=/; HttpOnly`,
  ]);
};
