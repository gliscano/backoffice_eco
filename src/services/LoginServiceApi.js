import APP_UTILS from 'src/config/app.utils';
import APP_CONFIG from '../config/app.config';

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
        user_id: response.data.user_id,
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

    const { userName, refresh } = credentials;
    const params = JSON.stringify({
      refresh,
      username: userName,
    });

    this.userName = userName;

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
}

export default LoginServiceApi;
