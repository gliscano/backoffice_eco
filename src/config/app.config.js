const APP_CONFIG = {
  API_ENDPOINT_BASE: process.env.REACT_APP_API_ENDPOINT_BASE,
  API_ENDPOINT_ADDRESS: 'user/address/',
  API_ENDPOINT_ADDRESS_INFO: 'user/address_info/',
  API_ENDPOINT_CATEGORY: 'store/categories/',
  API_ENDPOINT_CREATE_USER: 'user/create/',
  API_ENDPOINT_GET_PRODUCTS: 'store/products/',
  API_ENDPOINT_GET_STORES: 'store/stores/',
  API_ENDPOINT_GET_USER_BY_ID: 'user/users/',
  API_ENDPOINT_PRODUCT: 'store/products/',
  API_ENDPOINT_STORE: 'store/stores/',
  API_ENDPOINT_TOKEN_OBTAIN: 'user/token/obtain/',
  API_ENDPOINT_TOKEN_UPDATE: 'user/token/refresh/',
  API_USER_ID_TEST: 3,

  ROUTE_HOME: '/app',
  ROUTE_CREATE_STORE: '/app/createStore',
  ROUTE_EDIT_STORE: '/app/editStore',
  ROUTE_LOGIN: 'login',
  ROUTE_REGISTER: 'register',
  ROUTE_RESET_PASSWORD: 'resetPassword',
  APP_ADDRESS: 'address',
  COOKIES_ECO: 'cookiesEco',
};

export default APP_CONFIG;
