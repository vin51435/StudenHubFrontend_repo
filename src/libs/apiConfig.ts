import { AxiosResponse } from 'axios';
import { ApiEndpointKey, IMethodOptions, IRequestQueue, IResponse } from '../types';
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

const handleError = (error: any) => {
  const msg = error?.response?.data?.message || 'Server Error';
  console.error('API Error:', msg);
  if (import.meta.env.VITE_NODE_ENV !== 'production') throw new Error(msg);
};

// Public API methods

export const get = async <ResponseBody = any, T = IResponse<ResponseBody>>(
  apiEndpoint: ApiEndpointKey,
  options: Pick<IMethodOptions, 'BASE_URLS' | 'headers' | 'queue' | 'queries'> = {}
): Promise<T> => {
  const { BASE_URLS, headers = {}, queue = false, queries } = options;
  const api = createApiInstance(BASE_URLS, headers, queries);

  if (queue) {
    return addToQueue(() =>
      api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError)
    );
  }

  return api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};

export const post = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'headers' | 'queue'> = {}
): Promise<IResponse<ResponseBody>> => {
  const { data = {}, BASE_URLS, headers = {}, queue = false } = options;
  const api = createApiInstance(BASE_URLS, headers);

  if (queue) {
    return addToQueue(() =>
      api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const put = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'headers' | 'queue'> = {}
): Promise<IResponse<ResponseBody>> => {
  const { data = {}, BASE_URLS, headers = {}, queue = false } = options;
  const api = createApiInstance(BASE_URLS, headers);

  if (queue) {
    return addToQueue(() =>
      api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const patch = async <ResponseBody = any>(
  apiEndpoint: ApiEndpointKey,
  options: Pick<IMethodOptions, 'data' | 'BASE_URLS' | 'headers' | 'queue'> = {}
): Promise<ResponseBody> => {
  const { data = {}, BASE_URLS, headers = {}, queue = false } = options;
  const api = createApiInstance(BASE_URLS, headers);

  if (queue) {
    return addToQueue(() =>
      api.patch(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError)
    );
  }

  return api.patch(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const deleteResource = async (
  apiEndpoint: ApiEndpointKey,
  options: Pick<IMethodOptions, 'BASE_URLS' | 'headers' | 'queue'> = {}
) => {
  const { BASE_URLS, headers = {}, queue = false } = options;
  const api = createApiInstance(BASE_URLS, headers);

  if (queue) {
    return addToQueue(() =>
      api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError)
    );
  }

  return api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};
