import APP_UTILS from 'src/config/app.utils';

const ServiceApi = {
  processError: (response) => {
    const err = APP_UTILS.getError(response);
    return err;
  },

  request: async ({ url, params, method }) => {
    if (!url || !method) { return false; }

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-type': 'application/json;charset=UTF-8' },
        body: JSON.stringify(params),
      });

      if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response);
      }

      return Promise.reject(response);
    } catch (error) {
      console.log(error);
      return error;
    }
  },

  getWithToken: async ({ url, params, method }) => {
    if (!url || !method) { return false; }

    return fetch(url, {
      method,
      headers: {
        'Content-type': 'application/json;charset=UTF-8',
        Authorization: `JWT ${params.token}`,
      },
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.json());
        }

        return Promise.reject(response);
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  },
};

export default ServiceApi;
