import { Source } from 'graphql';
import { passwordRegex } from '@backend/utils/regex';
import { verify } from 'jsonwebtoken';
import { User } from '@backend/server';
import argon2 from 'argon2';
import {
  createAccessToken,
  createRefreshToken,
} from '@backend/auth/tokenCreators';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';
import { MyContext } from '@backend/utils/MyContext';

interface changePasswordInput {
  token: string;
  newPassword: string;
}

export const changePassword = {
  changePassword: async (
    _source: Source,
    { token, newPassword }: changePasswordInput,
    context: MyContext,
  ) => {
    let payload: any;
    try {
      payload = verify(token, process.env.ACCESS_JWT_SECRET);
    } catch (err) {
      console.log(err);
      throw new Error('Invalid token');
    }

    const [user] = await User.find({
      where: {
        id: payload.sub,
      },
    });

    if (!user) {
      throw new Error('User does not exist');
    }

    if (!passwordRegex.test(newPassword)) {
      throw new Error('Invalid password!');
    }

    const hashedPassword = await argon2.hash(newPassword);
    const { users } = await User.update({
      where: { id: payload.sub },
      update: {
        password: hashedPassword,
        tokenVersion: user.tokenVersion + 1,
      },
    });

    // log in user after password change
    sendRefreshToken(context.res, createRefreshToken(users[0]));

    return {
      username: user.username,
      accessToken: createAccessToken(users[0]),
    };
  },
};
