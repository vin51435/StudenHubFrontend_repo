import { AxiosResponse } from 'axios';
import { ApiEndpointKey, IErrorResponse, IMethodOptions, IRequestQueue, IResponse } from '../types';
import { createApiInstance } from './interceptors';
import { getApiEndpoint } from '../utils/apiUtils';

let requestQueue: IRequestQueue[] = [];

const processQueue = async () => {
  if (requestQueue.length === 0) return;

  const item = requestQueue.shift();
  if (!item) return; // or throw an error, depending on your requirements

  const { apiCall, resolve, reject } = item;

  try {
    const response = await apiCall();
    resolve(response);
  } catch (error) {
    reject(error);
  } finally {
    if (requestQueue.length > 0) {
      processQueue();
    }
  }
};

const addToQueue = (apiCall: () => Promise<any>): Promise<any> => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ apiCall, resolve, reject });
    if (requestQueue.length === 1) processQueue();
  });
};

const handleResponse = (response: AxiosResponse) => {
  if (response.status === 204) return response;
  return response.data;
};

const handleError = (error: IErrorResponse) => {
  const msg = error?.message || 'Server Error';
  console.error('Error:', msg);
  throw new Error(msg);
};

// Public API methods

export const get = async <ResponseBody = any, T = IResponse<ResponseBody>>(
  apiEndpoint: ApiEndpointKey | string,
  options: Pick<IMethodOptions, 'BASE_URLS' | 'bodyType' | 'queue' | 'queries'> = {}
): Promise<T> => {
  const { BASE_URLS, bodyType, queue = false, queries } = options;
  const api = createApiInstance(BASE_URLS, bodyType, queries);

  if (queue) {
    return addToQueue(() =>
      api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError)
    );
  }

  return api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};

export const post = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey | string,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'bodyType' | 'queue' | 'queries'> = {}
): Promise<IResponse<ResponseBody>> => {
  const { data = {}, BASE_URLS, bodyType, queue = false } = options;
  const api = createApiInstance(BASE_URLS, bodyType);

  if (queue) {
    return addToQueue(() =>
      api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const put = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey | string,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'bodyType' | 'bodyType' | 'queue'> = {}
): Promise<IResponse<ResponseBody>> => {
  const { data = {}, BASE_URLS, bodyType, queue = false } = options;
  const api = createApiInstance(BASE_URLS, bodyType);

  if (queue) {
    return addToQueue(() =>
      api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const patch = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey | string,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'bodyType' | 'queue' | 'bodyType'> = {}
): Promise<ResponseBody> => {
  const { data = {}, BASE_URLS, bodyType, queue = false } = options;
  const api = createApiInstance(BASE_URLS, bodyType);

  if (queue) {
    return addToQueue(() =>
      api.patch(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.patch(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const deleteResource = async (
  apiEndpoint: ApiEndpointKey | string,
  options: Pick<IMethodOptions, 'BASE_URLS' | 'bodyType' | 'queue'> = {}
) => {
  const { BASE_URLS, bodyType, queue = false } = options;
  const api = createApiInstance(BASE_URLS, bodyType);

  if (queue) {
    return addToQueue(() =>
      api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError)
    );
  }

  return api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};
