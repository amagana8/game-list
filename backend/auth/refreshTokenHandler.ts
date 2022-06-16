import { ogm, User } from '@backend/server';
import {
  createAccessToken,
  createRefreshToken,
} from '@backend/auth/tokenCreators';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';
import { verify } from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

async function initOgm() {
  await ogm.init();
}
initOgm();

const emptyRes = { username: '', accessToken: '' };

export const refreshTokenHandler = async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const token = req.cookies.refreshToken;
  if (!token) {
    return res.send(emptyRes);
  }

  let payload: any;
  try {
    payload = verify(token, process.env.REFRESH_JWT_SECRET);
  } catch (err) {
    console.log(err);
    return res.send(emptyRes);
  }

  // token is valid and we can send back an access token
  const [user] = await User.find({
    where: {
      id: payload.sub,
    },
  });

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    return res.send(emptyRes);
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({
    username: user.username,
    accessToken: createAccessToken(user),
  });
};
