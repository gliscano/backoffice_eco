/* eslint-disable prefer-object-spread */
import {
  SET_USER_DATA,
  CLEAR_USER_DATA,
  SET_STORE_DATA,
  GET_STORE_DATA,
  CLEAR_STORE_DATA
} from './action_types';

const initialState = {
  userData: {
    name: '',
    userName: '',
    lastName: '',
    email: '',
    token: '',
    refresh: '',
    logged: false,
  },
  storeData: {
    name: 'Nombre de la Marca',
    title: 'slogan',
    status: '',
    description: '',
    facebook: '',
    instagram: '',
    phone: '',
    store_id: '',
    address: 'Dirección',
    city: 'Ciudad',
    country: 'País',
    defaultLogo: '/static/images/store/yourLogo.png',
    urlImageLogo: '',
  },
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_USER_DATA: {
      const { storeData } = state;
      const mergeData = { ...state.userData, ...payload };
      return {
        userData: mergeData,
        storeData,
      };
    }
    case CLEAR_USER_DATA: {
      return { ...state, ...initialState };
    }
    case SET_STORE_DATA: {
      const { userData } = state;
      const data = { ...state.storeData, ...payload };
      return {
        userData,
        storeData: data,
      };
    }
    case GET_STORE_DATA: {
      return state.storeData;
    }
    case CLEAR_STORE_DATA: {
      return { ...state.storeData, ...initialState.storeData };
    }
    default:
      return state;
  }
};
export default userReducer;
