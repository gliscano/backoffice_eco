import APP_UTILS from 'src/config/app.utils';
import APP_CONFIG from '../config/app.config';

class CategoryServiceApi {
  constructor() {
    this.dataServer = null;
    this.error = null;
  }

  clearCredentiales() {
    this.token = '';
  }

  processError(response) {
    // Get type and message Error
    const err = APP_UTILS.getError(response);

    this.error = err;
    return err;
  }

  processResult(resp) {
    if (resp) {
      this.dataServer = resp;
      console.log(this.dataServer);
    }

    return resp;
  }

  /* CREATE NEW CATEGORY AND UPDATE CATEGORY */
  async createUpdateCategory(params, update) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_CATEGORY;

    const data = JSON.stringify({
      name: params.name,
      parent_category_id: params.parent_category_id || null,
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

        return Promise.reject(response);
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

  /* GET CATEGORIES */
  async getCategories(token, categoryId) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_CATEGORY;

    if (categoryId) {
      requestUrl += `/${categoryId}`;
    }

    const headers = new Headers({
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

  /* DELETE CATEGORY */
  async deleteCategory(params) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_CATEGORY;
    requestUrl += params.category_id;

    /* const data = JSON.stringify({
      name: params.name,
      parent_category_id: params.parent_category_id || null,
    }); */

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${params.token}`,
    });

    const method = 'DELETE';

    return fetch(requestUrl, {
      method,
      headers,
    })
      .then((response) => {
        if (response.status >= 200 && response.status < 300) {
          return Promise.resolve(response.ok);
        }

        return Promise.reject(response);
      })
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

export default CategoryServiceApi;
