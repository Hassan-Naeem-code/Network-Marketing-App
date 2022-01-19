/* eslint-disable prettier/prettier */
import { updateUserDataInRedux } from './middleware';

const userInfoReducer = (state, action) => {
  switch (action.type) {
    case 'setuser':
      return action.payload;

    case 'getuser':
      return state;

    case 'updateuser':
      state = updateUserDataInRedux(state, action.payload);
      return state;

    default:
      return null;
  }
};

const fetchLoaderStatus = (state, action) => {
  switch (action.type) {
    case 'start':
      return action.payload;

    default:
      return false;
  }
};

export { userInfoReducer, fetchLoaderStatus };
