import { Source } from 'graphql';
import { UpdateUserForm } from '@utils/types';
import { User } from '@backend/server';
import { usernameRegex, emailRegex } from '@backend/utils/regex';

export const updateUser = {
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

    if (newUsername && !usernameRegex.test(newUsername)) {
      throw new Error('Invalid username!');
    }

    if (newEmail && !emailRegex.test(newEmail)) {
      throw new Error('Invalid email!');
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
};
