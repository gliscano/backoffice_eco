import APP_CONFIG from '../config/app.config';

class LoginServiceApi {
  constructor() {
    this.token = null;
    this.dataServer = null;
    this.error = null;
  }

  clearCredentials() {
    this.token = '';
  }

  processError(err) {
    if (err) {
      this.error = err;
    }
  }

  processResult(resp) {
    if (resp) {
      this.dataServer = resp;
    }

    return resp;
  }

  async obtainTokenRequest(credentials) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_TOKEN_OBTAIN;

    const { username, password } = credentials;
    const params = JSON.stringify({
      username,
      password,
    });

    return fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: params,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then((response) => response.json())
      .then((resp) => {
        console.log('>>> Response Fetch');
        console.log(resp);

        const result = this.processResult(resp);
        return result;
      })
      .catch((error) => {
        this.processError(error);
        console.log(error);
        return error;
      });
  }

  async updateTokenRequest(refresh) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_TOKEN_UPDATE;

    const params = JSON.stringify({
      refresh,
    });

    return fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: params,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(new Error(response.statusText));
      })
      .then((response) => response.json())
      .then((resp) => {
        console.log(resp);

        const result = this.processResult(resp);
        return result;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
  }
}

export default LoginServiceApi;
