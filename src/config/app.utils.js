import APP_TEXTS from 'src/language/lang_ES';

const APP_UTILS = {
  getError: (responseApi) => {
    const error = {
      type: 'error',
      code: responseApi.status || 0,
      statusText: responseApi.statusText,
      message: APP_TEXTS.ERR_UNKNOWN,
    };

    switch (error.code) {
      case 401:
        error.message = APP_TEXTS.ERR_UN_AUTHORIZED;
        break;

      default:
        break;
    }

    return error;
  },
};

export default APP_UTILS;
