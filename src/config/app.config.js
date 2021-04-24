const APP_CONFIG = {
  API_ENDPOINT_BASE: process.env.REACT_APP_API_ENDPOINT_BASE,
  API_ENDPOINT_TOKEN_OBTAIN: 'user/token/obtain/',
  API_ENDPOINT_TOKEN_UPDATE: 'user/token/refresh/',
  API_ENDPOINT_CREATE_USER: 'user/create/',
  API_ENDPOINT_STORE: 'store/stores/',
  API_ENDPOINT_PRODUCT: 'store/products/',
  API_ENDPOINT_GET_USER_BY_ID: 'user/users/',
  API_ENDPOINT_GET_PRODUCTS: 'store/products/',
  API_ENDPOINT_GET_STORES: 'store/stores/',
};

export default APP_CONFIG;
