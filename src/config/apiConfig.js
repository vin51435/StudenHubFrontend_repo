import axios from 'axios';
import { getValueByKey } from '../utils';
import store from '@src/redux/store';

const dev = 'http://localhost:3001';
const prod = 'https://test.com';

const activeHost = import.meta.env.VITE_NODE_ENV === 'development' ? dev : prod;

const baseURLs = {
  apiBaseURL: `${activeHost}/api/v1/`,
  googleAuthBaseURL: `${activeHost}/auth/google`,
  githubAuthBaseURL: `${activeHost}/auth/github`,
  users: `${activeHost}/api/v1/users`
};

const baseURLsEndpoint = {
  USER_INFO: `/info`,
  USER_EMAIL_REG: '/emailReg',
  USER_EMAIL_VERIFY: '/emailVerify',
  USER_SIGNUP: '/signup',

  // Google OAuth
  GOOGLE_CALLBACK: '/callback',
  GITHUB_CALLBACK: '/callback',
};

const apiConfig = (baseURL, headers) => {
  let selectedHeaders;

  const selectedBaseURL = baseURLs[baseURL] || baseURL;

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
      const token = store.getState().auth.token;
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
      if (error.response && error.response.status === 401) {
        if (window.location.href !== '/login') {
          console.log('Unauthorized access - redirecting to login');
          window.location.href = '/login';
        }
      }
      // Handle errors globally
      return Promise.reject(error);
    }
  );

  return api;
};

export const getData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(baseURLsEndpoint, apiEndpoint); }
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const postData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(baseURLsEndpoint, apiEndpoint); }
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};

export const putData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(baseURLsEndpoint, apiEndpoint); }
  try {
    const response = await api.put(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error putting data:', error);
    throw error;
  }
};

export const deleteData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  let endpoint = apiEndpoint;
  if (!apiEndpoint.includes('/')) { endpoint = getValueByKey(baseURLsEndpoint, apiEndpoint); }
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error deleting data:', error);
    throw error;
  }
};

export const { githubAuthBaseURL, googleAuthBaseURL } = baseURLs;
