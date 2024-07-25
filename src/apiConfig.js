import axios from 'axios';
import { getValueByKey } from './utils';

const dev = 'http://localhost:3001';
const prod = 'https://test.com';

const activeHost = import.meta.env.VITE_NODE_ENV === 'development' ? dev : prod;

const apiBaseURL = `${activeHost}/api/v1/`;
const googleAuthBaseURL = `${activeHost}/auth/google`;
const githubAuthBaseURL = `${activeHost}/auth/github`;
const githubAuthBaseURL2 = `https://github.com/login/oauth/`;
const githubAuthBaseURL3 = `https://github.com/login/oauth/access_token`;

const urls = {
  API_URL: `/api`,
  OTHER_URL: `/other`,

  // Google OAuth
  GOOGLE_CALLBACK: '/callback',
  GITHUB_CALLBACK: '/callback',
};

const apiConfig = (token, baseURL, headers) => {
  let selectedBaseURL;
  let selectedHeaders;

  switch (baseURL) {
    case 'apiBaseURL':
      selectedBaseURL = apiBaseURL;
      break;
    case 'googleAuthBaseURL':
      selectedBaseURL = googleAuthBaseURL;
      break;
    case 'githubAuthBaseURL':
      selectedBaseURL = githubAuthBaseURL;
      break;
    default:
      selectedBaseURL = baseURL;
      break;
  }

  if (Object.entries(headers).length === 0) {
    selectedHeaders = { 'Content-Type': 'application/json' };
  } else {
    selectedHeaders = headers;
  }
  const api = axios.create({
    baseURL: selectedBaseURL,
    headers: selectedHeaders,
  });

  // Add a request interceptor (optional)
  api.interceptors.request.use(
    (request) => {
      // You can add authorization tokens here if needed
      if (token) {
        request.headers.Authorization = `Bearer ${token}`;
      }
      return request;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Add a response interceptor (optional)
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Handle errors globally
      return Promise.reject(error);
    }
  );

  return api;
};

export const getData = async (apiEndpoint, options = {}) => {
  const { token = null, baseURL, headers = {} } = options;
  const api = apiConfig(token, baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(urls, apiEndpoint); }
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (apiEndpoint, options = {}) => {
  const { data = {}, token = null, baseURL, headers = {} } = options;
  const api = apiConfig(token, baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(urls, apiEndpoint); }
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const putData = async (apiEndpoint, options = {}) => {
  const { data = {}, token = null, baseURL, headers = {} } = options;
  const api = apiConfig(token, baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(urls, apiEndpoint); }
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error putting data:', error);
    throw error;
  }
};

export const deleteData = async (apiEndpoint, options = {}) => {
  const { token = null, baseURL, headers = {} } = options;
  const api = apiConfig(token, baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(urls, apiEndpoint); }
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

