import { Source } from 'graphql';
import { UserForm } from '@utils/types';
import { sign } from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '@backend/server';

export const signIn = {
  signIn: async (_source: Source, { email, password }: UserForm) => {
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

    return sign(
      { sub: user.id, username: user.username },
      process.env.JWT_SECRET,
    );
  },
};
