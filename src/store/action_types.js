export const SET_USER_DATA = 'SET_USER_DATA';
export const CLEAR_USER_DATA = 'CLEAR_USER_DATA';
export const GET_STORE_DATA = 'GET_STORE_DATA';
export const SET_STORE_DATA = 'SET_STORE_DATA';
export const CLEAR_STORE_DATA = 'CLEAR_STORE_DATA';

export const setUserData = (text) => ({
  type: SET_USER_DATA,
  payload: text,
});

export const clearUserData = () => ({
  type: CLEAR_USER_DATA,
  payload: '',
});

export const setStoreData = (obj) => ({
  type: SET_STORE_DATA,
  payload: obj,
});

export const getStoreData = () => ({
  type: GET_STORE_DATA,
  payload: '',
});

export const clearStoreData = () => ({
  type: CLEAR_STORE_DATA,
  payload: '',
});
