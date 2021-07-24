import APP_CONFIG from '../config/app.config';

class UserServiceApi {
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
  }

  async create(data) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_CREATE_USER;

    const params = JSON.stringify({
      name: data.name,
      lastname: data.lastname,
      username: data.username,
      email: data.email,
      password: data.password
    });

    await fetch(requestUrl, {
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
        this.processResult(resp);
      })
      .catch((error) => {
        this.processError(error);
        console.log(error);
      });
  }

  async getInfoByUser(userId, token) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_GET_USER_BY_ID;
    requestUrl += userId;

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
        this.dataServer = resp;
        return resp;
      })
      .catch((error) => {
        console.log('Error');
        console.log(error);
      });
  }
}

export default UserServiceApi;
