import APP_CONFIG from '../config/app.config';

class UserServiceApi {
  constructor() {
    this.token = null;
    this.dataServer = null;
    this.error = null;
  }

  processError(err) {
    this.error = err;
    return this.error;
  }

  processResult(resp) {
    this.dataServer = resp;
    return this.dataServer;
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

    return fetch(requestUrl, {
      method: 'POST',
      headers: { 'Content-type': 'application/json;charset=UTF-8' },
      body: params,
    })
      .then((response) => response.json())
      .then((resp) => {
        return this.processResult(resp);
      })
      .catch((error) => {
        console.log(error);
        return this.processError(error);
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
