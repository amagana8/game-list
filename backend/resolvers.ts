import { Source } from 'graphql';
import { UserForm, UpdateUserForm } from '@utils/types';
import { sign } from 'jsonwebtoken';
import argon2 from 'argon2';
import { User } from '../pages/api/graphql';

export const resolvers = {
  Mutation: {
    signUp: async (
      _source: Source,
      { username, email, password }: UserForm,
    ) => {
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
        throw new Error(
          `User with email ${email.toLowerCase()} already exists!`,
        );
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

      return sign(
        { sub: users[0].id, username: users[0].username },
        process.env.JWT_SECRET,
      );
    },
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
    updateUserDetails: async (
      _source: Source,
      { username, newUsername, newEmail }: UpdateUserForm,
      context: any,
    ) => {
      const [user] = await User.find({
        where: {
          username,
        },
      });

      if (!context.auth.jwt || user.id !== context.auth.jwt.sub) {
        throw new Error('Unauthorized request. Please login and try again.');
      }

      if (newUsername) {
        const [existingUsername] = await User.find({
          where: {
            username_MATCHES: `(?i)${newUsername}`,
          },
        });

        if (existingUsername) {
          throw new Error(
            `User with username ${newUsername.toLowerCase()} already exists!`,
          );
        } else {
          User.update({
            where: {
              username,
            },
            update: {
              username: newUsername,
            },
          });
        }
      }

      if (newEmail) {
        const [existingEmail] = await User.find({
          where: {
            email: `(?i)${newEmail}`,
          },
        });

        if (existingEmail) {
          throw new Error(
            `User with email ${newEmail.toString()} already exists!`,
          );
        } else {
          User.update({
            where: {
              username,
            },
            update: {
              email: newEmail,
            },
          });
        }
      }

      if (newUsername) {
        return newUsername;
      } else {
        return username;
      }
    },
  },
};
