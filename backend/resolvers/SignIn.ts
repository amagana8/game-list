import { Source } from 'graphql';
import { UserForm } from '@utils/types';
import {
  createRefreshToken,
  createAccessToken,
} from '@backend/auth/tokenCreators';
import argon2 from 'argon2';
import { User } from '@backend/server';
import { MyContext } from '@backend/utils/MyContext';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';

export const signIn = {
  signIn: async (
    _source: Source,
    { email, password }: UserForm,
    context: MyContext,
  ) => {
    const [user] = await User.find({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error(`User with email ${email} not found!`);
    }

    const correctPassword = await argon2.verify(user.password, password);

    if (!correctPassword) {
      throw new Error(`Incorrect password for user with email ${email}!`);
    }

    sendRefreshToken(context.res, createRefreshToken(user));

    return createAccessToken(user);
  },
};
