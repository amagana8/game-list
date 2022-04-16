import { constants } from '@actions/constants';

export const login = () => (dispatch: any) => {
  dispatch({
    type: constants.LOGIN,
    user: 'PaleteroMan',
  });
};
