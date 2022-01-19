/* eslint-disable prettier/prettier */
const setUserInfo = value => {
  return {
    type: 'setuser',
    payload: value,
  };
};
const getUserInfo = value => {
  return {
    type: 'getuser',
    payload: value,
  };
};

const updateUserInfo = value => {
  return {
    type: 'updateuser',
    payload: value,
  };
};

const startPageLoader = value => {
  return {
    type: 'start',
    payload: value,
  };
};
export { setUserInfo, getUserInfo, startPageLoader, updateUserInfo };