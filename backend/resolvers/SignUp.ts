import { Source } from 'graphql';
import { sign } from 'jsonwebtoken';
import argon2 from 'argon2';
import { UserForm } from '@utils/types';
import { User } from '@backend/server';
import { usernameRegex, emailRegex, passwordRegex } from '@backend/utils/regex';
import { MyContext } from '@backend/utils/MyContext';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';
import {
  createAccessToken,
  createRefreshToken,
} from '@backend/auth/tokenCreators';

export const signUp = {
  signUp: async (
    _source: Source,
    { username, email, password }: UserForm,
    context: MyContext,
  ) => {
    if (!usernameRegex.test(username)) {
      throw new Error('Invalid username!');
    }

    if (!emailRegex.test(email)) {
      throw new Error('Invalid email!');
    }

    if (!passwordRegex.test(password)) {
      throw new Error('Invalid password!');
    }

    const [existingUsername] = await User.find({
      where: {
        username_MATCHES: `(?i)${username}`,
      },
    });

    if (existingUsername) {
      throw new Error(
        `User with username ${username.toLowerCase()} already exists!`,
      );
    }

    const [existingEmail] = await User.find({
      where: {
        email_MATCHES: `(?i)${email}`,
      },
    });

    if (existingEmail) {
      throw new Error(`User with email ${email.toLowerCase()} already exists!`);
    }

    password = await argon2.hash(password);

    const { users } = await User.create({
      input: [
        {
          username,
          email,
          password,
        },
      ],
    });

    sendRefreshToken(context.res, createRefreshToken(users[0]));

    return {
      username: users[0].username,
      accessToken: createAccessToken(users[0]),
    };
  },
};
