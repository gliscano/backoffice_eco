import APP_UTILS from 'src/config/app.utils';
import APP_CONFIG from '../config/app.config';
import ServiceApi from './ServiceApi';

class LoginServiceApi {
  constructor() {
    this.token = null;
    this.error = null;
    this.userName = null;
    this.dataServer = null;
  }

  processError(response) {
    const err = APP_UTILS.getError(response);

    this.error = err;
    return err;
  }

  getDataLocalStorage() {
    let data = localStorage.getItem(APP_CONFIG.COOKIES_ECO);
    data = (data) ? JSON.parse(data) : null;

    if (data && data.logged && data.refresh) {
      return data;
    }

    this.clearDataLocalStorage();
    return false;
  }

  setDataLocalStorage(data) {
    localStorage.setItem(APP_CONFIG.COOKIES_ECO, JSON.stringify(data));
    this.dataServer = data;
  }

  clearDataLocalStorage() {
    localStorage.setItem(APP_CONFIG.COOKIES_ECO, '');
    this.token = null;
    this.dataServer = null;
  }

  processResult(response) {
    // if login is success, save token
    if (response && response.data) {
      const loginData = {
        userName: this.userName,
        token: response.data.access,
        refresh: response.data.refresh,
        user_id: response.data.user_id || this.userName,
        userId: response.data.user_id || this.userName,
        logged: true,
      };

      this.setDataLocalStorage(loginData);
      return loginData;
    }
    return false;
  }

  logout() {
    this.clearDataLocalStorage();
  }

  async obtainTokenRequest(credentials) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_TOKEN_OBTAIN;

    const { username, password } = credentials;
    const params = JSON.stringify({
      username,
      password,
    });

    this.userName = username;

    return fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: params,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(response);
      })
      .then((response) => response.json())
      .then((resp) => {
        const result = this.processResult(resp);
        return result;
      })
      .catch((error) => {
        const err = this.processError(error);
        return err;
      });
  }

  async updateTokenRequest(credentials) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_TOKEN_UPDATE;

    const { userId, refresh } = credentials;
    const params = JSON.stringify({
      refresh,
      username: userId,
    });

    this.userName = userId;

    return fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: params,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response);
        }

        return Promise.reject(response);
      })
      .then((response) => response.json())
      .then((resp) => {
        const result = this.processResult(resp);
        return result;
      })
      .catch((error) => {
        const err = this.processError(error);
        return err;
      });
  }

  async forgetPasswordRequest(credentials) {
    let url = APP_CONFIG.API_ENDPOINT_BASE;
    url += APP_CONFIG.API_ENDPOINT_FORGOT_PASSWORD;
    const method = 'POST';
    const params = {
      email: credentials.username,
    };

    this.clearDataLocalStorage();
    return ServiceApi.request({ url, params, method })
      .then((resp) => resp)
      .catch((resp) => resp);
  }

  async verificationEmail(credentials) {
    let url = APP_CONFIG.API_ENDPOINT_BASE;
    url += APP_CONFIG.API_ENDPOINT_FORGOT_PASSWORD;
    const method = 'POST';
    const params = {
      username: credentials.username,
      password: credentials.password,
      name: credentials.name,
      lastname: credentials.lastname,
      emai: credentials.emai,
      tokenValidation: credentials.tokenValidation,
    };

    this.clearDataLocalStorage();
    const response = ServiceApi.request({ url, params, method });
    return response;
  }
}

export default LoginServiceApi;
