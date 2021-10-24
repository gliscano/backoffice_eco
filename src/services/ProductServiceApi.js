import APP_UTILS from 'src/config/app.utils';
import APP_CONFIG from '../config/app.config';

class ProductServiceApi {
  constructor() {
    this.dataServer = null;
    this.error = null;
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
    }

    return resp;
  }

  /* CREATE NEW PRODUCT AND UPDATE PRODUCT */
  async createUpdateProduct(params) {
    if (!params) {
      return false;
    }

    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_PRODUCT;
    if (params.update) {
      requestUrl += `${params.product_id}`;
    }

    const categoryId = params.subcategoryId || params.categoryId;
    const data = JSON.stringify({
      category_id: categoryId,
      code: params.code,
      description: params.description,
      price: params.price,
      status: params.status || 'active',
      stock: params.stock,
      store_id: params.storeId,
      title: params.title,
      url_photos: params.photos,
    });

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${params.token}`,
    });

    const method = (params.update) ? 'PUT' : 'POST';

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
        const err = this.processError(error);
        return err;
      });
  }

  /* GET PRODUCTS */
  async getProducts(token) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_GET_PRODUCTS;

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
        return result;
      })
      .catch((error) => {
        const err = this.processError(error);
        return err;
      });
  }

  /* DELETE PRODUCT */
  async deleteProduct(params) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_PRODUCT;
    requestUrl += Number(params.idProduct);

    let headers = {};
    headers = new Headers({
      'Content-Type': 'application/json',
      Authorization: `JWT ${params.token}`,
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
        const err = this.processError(error);
        return err;
      });
  }
}

export default ProductServiceApi;
