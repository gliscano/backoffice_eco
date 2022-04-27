/* eslint-disable prefer-object-spread */
import APP_TEXTS from 'src/language/lang_ES';
import {
  SET_ALERT_DATA,
  HIDE_ALERT,
  SET_USER_DATA,
  CLEAR_USER_DATA,
  SET_STORE_DATA,
  GET_STORE_DATA,
  CLEAR_STORE_DATA
} from './action_types';

const initialState = {
  app: {
    alert: {
      open: false,
      message: '',
      button: APP_TEXTS.ACCEPT_BTN,
      severity: 'info',
      callback: null,
    }
  },
  userData: {
    email: '',
    lastname: '',
    logged: false,
    name: '',
    ownerId: '',
    phone: '',
    refresh: '',
    token: '',
    typeUser: '',
    user_id: '',
    username: '',
  },
  storeData: {
    category: '',
    city: '',
    defaultLogo: '/static/images/store/yourLogo.png',
    description: '',
    facebook: '',
    instagram: '',
    name: '',
    phone: '',
    postalCode: '',
    state: '',
    status: '',
    store_id: '',
    street: '',
    title: '',
    urlImageLogo: '',
  },
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_ALERT_DATA: {
      const { userData, storeData } = state;
      const mergeData = { ...state.app, ...payload };
      console.log('REDUCER APP ALERT', mergeData);
      return {
        app: mergeData,
        userData,
        storeData,
      };
    }
    case HIDE_ALERT: {
      const { app, userData, storeData } = state;
      const clearAlertData = { ...app.alert, ...initialState.app.alert };
      app.alert = { ...clearAlertData };
      console.log('REDUCER HIDE ALERT', app);
      return {
        app,
        userData,
        storeData,
      };
    }
    case SET_USER_DATA: {
      const { app, storeData } = state;
      const mergeData = { ...state.userData, ...payload };
      return {
        userData: mergeData,
        storeData,
        app,
      };
    }
    case CLEAR_USER_DATA: {
      const { app, storeData } = state;
      const mergeData = { ...state.userData, ...initialState.userData };
      return {
        userData: mergeData,
        storeData,
        app,
      };
    }

    case SET_STORE_DATA: {
      const { app, userData } = state;
      const data = { ...state.storeData, ...payload };
      return {
        storeData: data,
        userData,
        app,
      };
    }

    case GET_STORE_DATA: {
      return state.storeData;
    }
    case CLEAR_STORE_DATA: {
      const { app, userData } = state;
      const data = { ...state.storeData, ...initialState.storeData };
      return {
        storeData: data,
        userData,
        app,
      };
    }
    default:
      return state;
  }
};
export default userReducer;
