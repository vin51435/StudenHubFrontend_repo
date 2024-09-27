import axios from 'axios';
import { getValueByKey } from '../utils';
import store from '@src/redux/store';

const dev = `http://${import.meta.env.VITE_DEV_BACKEND_HOST}:3001`;
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
  USER_FORGOT_PASSWORD: '/forgotPassword',
  USER_LOGIN: '/login',

  // Get user's academic/education details
  USER_ACADEMIC_PROGRAMS:'/academicprograms/academicdetails',
  
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
      if (error.response) {
        if (error.response.status === 401) {
          if (window.location.pathname !== '/login') {
            console.log('Unauthorized access - redirecting to login');
            window.location.href = '/login';
          }
        } else if (error.response.status === 500) {
          console.error('Server error - please try again later');
          // Optionally, show a user-friendly message
        }
      } else {
        console.error('Network error - please check your connection');
      }
      return Promise.reject(error);
    }

  );

  return api;
};

const handleResponse = (response) => {
  if (response.status === 204) return response;
  return response.data;
};

const handleError = (error) => {
  // Check if the error has a response and a message
  if (error.response && error.response.data) {
    console.error('Error:', error.response.data.message || error.response.data);
    return error.response.data;
  } else {
    console.error('Error:', error);
    throw error;
  }
};

const getApiEndpoint = (apiEndpoint) => {
  return apiEndpoint.includes('/') ? apiEndpoint : getValueByKey(baseURLsEndpoint, apiEndpoint);
};

export const getData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  try {
    const response = await api.get(getApiEndpoint(apiEndpoint));
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const postData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  try {
    const response = await api.post(getApiEndpoint(apiEndpoint), data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const putData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  try {
    const response = await api.put(getApiEndpoint(apiEndpoint), data);
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const deleteData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {} } = options;
  const api = apiConfig(baseURL, headers);
  try {
    const response = await api.delete(getApiEndpoint(apiEndpoint));
    return handleResponse(response);
  } catch (error) {
    return handleError(error);
  }
};

export const { githubAuthBaseURL, googleAuthBaseURL } = baseURLs;
