import APP_CONFIG from '../config/app.config';

class StoreServiceApi {
  constructor() {
    this.dataServer = null;
    this.error = null;
  }

  clearCredentiales() {
    this.token = '';
  }

  processError(err) {
    if (err) {
      this.error = err;
      console.log(err);
    }
  }

  processResult(resp) {
    if (resp) {
      this.dataServer = resp;
      console.log(this.dataServer);
    }

    return resp;
  }

  /* CREATE NEW STORE AND UPDATE STORE */
  async requestPost(params, update) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_STORE;

    if (update && params && params.userId) {
      requestUrl += params.storeId;
    }

    const data = JSON.stringify({
      name: params.name,
      user_id: params.userId,
      description: params.description,
      keywords: params.keywords,
      title: params.title,
      phone: params.phone,
      facebook: params.facebook,
      instagram: params.instagram,
    });

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${params.token}`,
    });

    const method = (update) ? 'PUT' : 'POST';

    return fetch(requestUrl, {
      method,
      body: data,
      headers,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then((response) => response.json())
      .then((resp) => {
        const result = this.processResult(resp);
        return result;
      })
      .catch((error) => {
        this.processError(error);
        console.log(error);
      });
  }

  /* GET STORES */
  async getStores(token) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_GET_STORES;

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    });

    return fetch(requestUrl, {
      method: 'GET',
      headers,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then((response) => response.json())
      .then((resp) => {
        const result = this.processResult(resp);
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      });
  }

  /* DELETE STORE */
  async deleteStore(token, idStore) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_STORE;
    requestUrl += Number(idStore);

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${token}`,
    });

    return fetch(requestUrl, {
      method: 'DELETE',
      headers,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then((resp) => {
        const result = this.processResult(resp);
        return (result && result.ok);
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      });
  }
}

export default StoreServiceApi;
