/* eslint-disable prettier/prettier */
const updateUserDataInRedux = (state, payload) => {
  const newState = { ...state };
  Object.assign(newState, payload);
  return newState;
};

export { updateUserDataInRedux };
