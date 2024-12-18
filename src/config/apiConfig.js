import axios from 'axios';
import { getValueByKey } from '../utils';
import store from '@src/redux/store';
import { loginSuccess } from '@src/redux/reducer';

export const activeHost = import.meta.env.VITE_NODE_ENV === 'development' ? import.meta.env.VITE_DEV_BACKEND_DEV : import.meta.env.VITE_DEV_BACKEND_PROD;

const baseURLs = {
  googleAuthBaseURL: `${activeHost}/oauth2/google`,
  githubAuthBaseURL: `${activeHost}/oauth2/github`,
  userAuth: `${activeHost}/api/v1/auth`,
  user: `${activeHost}/api/v1/user`,
  userFormats: `${activeHost}/api/v1/userformat`,
};

const baseURLsEndpoint = {
  // User Auth endpoints
  USER_INFO: `/info`,
  USER_EMAIL_REG: '/emailReg',
  USER_EMAIL_VERIFY: '/emailVerify',
  USER_SIGNUP: '/signup',
  USER_SIGNUP_ADDITIONAL_DETAILS: '/signupdetails',
  USER_SIGNUP_INTEREST: '/signupinterest',
  USER_FORGOT_PASSWORD: '/forgotPassword',
  USER_LOGIN: '/login',

  // Get user's academic/education details
  USER_ACADEMIC_PROGRAMS: '/academicprograms/academicdetails',

  // Google OAuth
  GOOGLE_CALLBACK: '/callback',
  GITHUB_CALLBACK: '/callback',

  // User Communication apis
  GET_INBOX_PARTICIPANTS: '/getSecondParticipants',
  USERS_BY_ID: '/usersbyid',
  CHAT_ID: '/chatid',
  GET_MESSAGES_BY_CHAT_ID: '/messages',
  CHATS: '/chats',

  // User Non-auth
  SEARCH_USERS: '/search',
  USER_NOTIFICATIONS: '/notifications',

  // User Formats
  GET_CITY_STATES: '/getcitystate',
  GET_INTERESTS: '/userinterests'
};

let requestQueue = [];

const processQueue = async () => {
  if (requestQueue.length === 0) return; // If there's nothing in the queue, do nothing

  const { apiCall, resolve, reject } = requestQueue.shift(); // Dequeue the first API call

  try {
    const response = await apiCall(); // Execute the API call
    resolve(response); // Resolve the original promise with the API data
  } catch (error) {
    reject(error); // Reject the promise if an error occurs
  } finally {
    if (requestQueue.length > 0) {
      processQueue(); // Process the next request in the queue if it exists
    }
  }
};

const addToQueue = (apiCall) => {
  return new Promise((resolve, reject) => {
    requestQueue.push({ apiCall, resolve, reject }); // Add the request to the queue
    if (requestQueue.length === 1) {
      processQueue(); // Start processing if it's the first request in the queue
    }
  });
};

const apiConfig = (baseURL, headers, queries) => {
  let selectedHeaders;

  const selectedBaseURL = baseURLs[baseURL] || baseURL;

  if (Object.entries(headers).length === 0) {
    selectedHeaders = { 'Content-Type': 'application/json', "ngrok-skip-browser-warning": "69420" };
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
      if (queries && queries.length > 0) {
        request.params = {
          ...request.params, // Keep existing params
          ...Object.fromEntries(queries.map(query => Object.entries(query).flat())),
        };
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
      if (response?.data) {
        const { data, redirectUrl } = response.data;
        if (data?.updatedUser) {
          store.dispatch(loginSuccess({ user: data?.updatedUser }));
        }
        if (redirectUrl && window.location.pathname !== redirectUrl) {
          window.location.href = response.data.redirectUrl;
        }
      }
      return response;
    },
    (error) => {
      if (error.response) {
        if (error.response.status === 401) {
          if (window.location.pathname !== '/login') {
            console.warn('Unauthorized access - redirecting to login');
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
    throw new Error(error.response.data.message || 'An error occurred');
  } else {
    console.error('Error:', error);
    throw error;
  }
};

const getApiEndpoint = (apiEndpoint) => {
  return Object.keys(baseURLsEndpoint).includes(apiEndpoint) ? getValueByKey(baseURLsEndpoint, apiEndpoint) : apiEndpoint;
  // return apiEndpoint.includes('/') ? apiEndpoint : getValueByKey(baseURLsEndpoint, apiEndpoint);
};

/**
 * Fetches data from an API endpoint, with optional configurations like base URL, headers, and queue management.
 *
 * @param {string} apiEndpoint - A predefined endpoint variable of a URL.
 * @param {Object} [options={}] - Optional configurations for the request.
 * @param {string} [options.baseURL] - A predefined base URL for the API.
 * @param {Object} [options.headers={}] - An object representing custom headers to send with the request.
 * @param {boolean} [options.queue=false] - If true, the request is added to a queue and executed later.
 * @param {array} [options.queries] - Query parameters to append to the request URL.
 * 
 * @returns {Promise<any>} - A promise that resolves with the API response or rejects with an error.
 */
export const getData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {}, queue = false, queries } = options; // Default queue is true
  const api = apiConfig(baseURL, headers, queries);

  // If queue is true, add the request to the queue
  if (queue) {
    return addToQueue(() => api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError));
  }

  // Otherwise, bypass the queue and execute the request immediately
  return api.get(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};

/**
 * Post data to an API endpoint, with optional configurations like base URL, headers, and queue management.
 *
 * @param {string} apiEndpoint - A predefined endpoint variable of a URL.
 * @param {Object} [options={}] - Optional configurations for the request.
 * @param {string} [options.baseURL] - A predefined base URL for the API.
 * @param {Object} [options.headers={}] - An object representing custom headers to send with the request.
 * @param {boolean} [options.queue=false] - If true, the request is added to a queue and executed later.
 * @param {Object} [options.data] - Request Body.
 * 
 * @returns {Promise<any>} - A promise that resolves with the API response or rejects with an error.
 */
export const postData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {}, queue = false } = options;
  const api = apiConfig(baseURL, headers);

  if (queue) {
    return addToQueue(() => api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError));
  }

  return api.post(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const putData = async (apiEndpoint, options = {}) => {
  const { data = {}, baseURL, headers = {}, queue = false } = options;
  const api = apiConfig(baseURL, headers);

  if (queue) {
    return addToQueue(() => api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError));
  }

  return api.put(getApiEndpoint(apiEndpoint), data).then(handleResponse).catch(handleError);
};

export const deleteData = async (apiEndpoint, options = {}) => {
  const { baseURL, headers = {}, queue = false } = options;
  const api = apiConfig(baseURL, headers);

  if (queue) {
    return addToQueue(() => api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError));
  }

  return api.delete(getApiEndpoint(apiEndpoint)).then(handleResponse).catch(handleError);
};

export const { githubAuthBaseURL, googleAuthBaseURL } = baseURLs;
