import APP_UTILS from 'src/config/app.utils';
import APP_CONFIG from '../config/app.config';
import ServiceApi from './ServiceApi';

class AddressServiceApi {
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

  /* CREATE NEW ADDRESS AND UPDATE ADDRESS */
  async createUpdateAddress(params) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_ADDRESS;
    requestUrl += (params.update && params.addressId) ? params.addressId : '';

    const data = JSON.stringify({
      city: params.city,
      extra_info: params.extraInfo,
      owner_id: params.ownerId,
      owner_type: params.typeUser,
      postal_code: params.postalCode,
      property_id: params.propertyId,
      property_type: params.propertyType,
      state: params.state,
      street: params.street,
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

  /* GET STORE AND PERSONAL ADDRESS */
  async getAddress(token) {
    let requestUrl = APP_CONFIG.API_ENDPOINT_BASE;
    requestUrl += APP_CONFIG.API_ENDPOINT_ADDRESS;

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

  async deleteAddress(data) {
    let url = APP_CONFIG.API_ENDPOINT_BASE;
    url += APP_CONFIG.API_ENDPOINT_ADDRESS;
    const method = 'DELETE';
    const params = {
      address_id: data.address_id,
    };

    let response = ServiceApi.request({ url, params, method });
    response = this.processResult(response);
    return response;
  }
}

export default AddressServiceApi;
