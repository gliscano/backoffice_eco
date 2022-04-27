import APP_TEXTS from 'src/language/lang_ES';

const APP_UTILS = {
  getError: async (responseApi) => {
    const error = {
      code: responseApi.status || 0,
      message: APP_TEXTS.ERR_UNKNOWN,
      statusText: responseApi.statusText,
      type: 'error',
    };

    switch (error.code) {
      case 401:
        error.message = APP_TEXTS.ERR_UN_AUTHORIZED;
        break;

      case 404:
        error.message = APP_TEXTS.ERR_UN_AUTHORIZED;
        break;

      default:
        break;
    }

    return error;
  },
};

export default APP_UTILS;
