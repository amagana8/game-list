import { Source } from 'graphql';
import { User } from '@backend/server';
import { sendResetEmail } from '@backend/auth/sendResetEmail';

import { createAccessToken } from '@backend/auth/tokenCreators';

interface forgotPasswordForm {
  email: string;
}

export const forgotPassword = {
  forgotPassword: async (_source: Source, { email }: forgotPasswordForm) => {
    const [user] = await User.find({
      where: {
        email,
      },
    });

    if (!user) {
      return true;
    }

    await sendResetEmail(email, createAccessToken(user));

    return true;
  },
};
