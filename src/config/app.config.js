const APP_CONFIG = {
  // ENVS
  API_ENDPOINT_BASE: process.env.REACT_APP_API_ENDPOINT_BASE,
  FIREBASE_APIKEY: process.env.REACT_APP_FIREBASE_APIKEY,
  FIREBASE_AUTHDOMAIN: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  FIREBASE_PROJECTID: process.env.REACT_APP_FIREBASE_PROJECTID,
  FIREBASE_STORAGEBUCKET: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  FIREBASE_MESSAGINGSENDERID: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  FIREBASE_APPID: process.env.REACT_APP_FIREBASE_APPID,
  FIREBASE_MEASUREMENTID: process.env.REACT_APP_FIREBASE_MEASUREMENTID,

  // API - USER ENDPOINTS
  API_ENDPOINT_ADDRESS: 'user/address/',
  API_ENDPOINT_ADDRESS_INFO: 'user/address_info/',
  API_ENDPOINT_CREATE_USER: 'user/create/',
  API_ENDPOINT_TOKEN_OBTAIN: 'user/token/obtain/',
  API_ENDPOINT_TOKEN_UPDATE: 'user/token/refresh/',
  API_ENDPOINT_FORGOT_PASSWORD: 'user/forgot_password/',
  API_ENDPOINT_RESET_PASSWORD: 'user/reset_password/',

  // API STORE ENDPOINTS
  API_ENDPOINT_GET_USER_BY_ID: 'user/users/',
  API_ENDPOINT_CATEGORY: 'store/categories/',
  API_ENDPOINT_SUBCATEGORY: 'store/subcategories/',
  API_ENDPOINT_GET_PRODUCTS: 'store/products/',
  API_ENDPOINT_GET_STORES: 'store/stores/',
  API_ENDPOINT_GET_STORE_BY_USER: 'user/users/store/',
  API_ENDPOINT_PRODUCT: 'store/products/',
  API_ENDPOINT_STORE: 'store/stores/',

  // Route Path
  ROUTE_ACCOUNT: '/app/account',
  ROUTE_ADDRESS: '/app/address',
  ROUTE_CATEGORY: '/app/category',
  ROUTE_CREATE_CATEGORY: '/category/add',
  ROUTE_CREATE_PRODUCT: '/products/add',
  ROUTE_CREATE_STORE: '/app/createStore',
  ROUTE_CUSTOMERS: '/app/customers',
  ROUTE_DASHBOARD: '/app/dashboard',
  ROUTE_EDIT_PRODUCT: '/products/edit',
  ROUTE_EDIT_STORE: '/app/editStore',
  ROUTE_FORGOT_PASSWORD: 'forgotPassword',
  ROUTE_GENERATE_QR: '/app/qr',
  ROUTE_HOME: '/app',
  ROUTE_MAIN: '/',
  ROUTE_ORDERS: '/app/orders',
  ROUTE_PRODUCTS: '/app/products',
  ROUTE_SETTINGS: '/app/settings',
  ROUTE_STORE: '/app/store',
  ROUTE_LOGIN: 'login',
  ROUTE_REGISTER: 'register',
  ROUTE_WELCOME: 'welcome',
  ROUTE_VALIDATION_DONE: 'validationDone',

  APP_ADDRESS: 'address',
  COOKIES_ECO: 'cookiesEco',
};

export default APP_CONFIG;
