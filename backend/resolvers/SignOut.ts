import { Source } from 'graphql';
import { MyContext } from '@backend/utils/MyContext';
import { sendRefreshToken } from '@backend/auth/sendRefreshToken';

export const signOut = {
  signOut: async (_source: Source, {}, context: MyContext) => {
    sendRefreshToken(context.res, '');
    return true;
  },
};
