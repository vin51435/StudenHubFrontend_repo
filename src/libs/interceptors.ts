import axios, { AxiosInstance } from 'axios';
import store from '../redux/store';
import { loginSuccess } from '../redux/reducers/auth';
import { BASE_URLS } from './apiEndpoints';
import { BaseUrlType } from '../types';
import { ErrorCodes } from '@src/contants/errorCodes';
import { getRoutePath } from '@src/utils/getRoutePath';
import { setLoading } from '@src/redux/reducers/uiSlice';

function redirection(redirectUrl: string, errorCode?: string) {
  store.dispatch(setLoading(true));
  let redirectPath: string = redirectUrl;

  if (errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_DETAILS) {
    redirectPath = getRoutePath('SIGNUP.DETAILS');
  } else if (errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_INTERESTS) {
    redirectPath = getRoutePath('SIGNUP.INTERESTS');
  }

  if (redirectPath && window.location.pathname !== redirectPath) {
    window.location.href = redirectPath;
  }
  store.dispatch(setLoading(false));
}

/**
 * Adds request and response interceptors to an Axios instance.
 */
export const attachInterceptors = (api: AxiosInstance, queries?: Array<Record<string, string>>) => {
  // Request interceptor
  api.interceptors.request.use(
    (request) => {
      request.withCredentials = true;

      request.headers['ngrok-skip-browser-warning'] = '69420';

      // Append dynamic query params
      if (queries && queries.length > 0) {
        request.params = {
          ...request.params, // Keep existing params
          ...Object.fromEntries(
            queries.map((query: { [key: string]: string }) => Object.entries(query).flat())
          ),
        };
      }

      return request;
    },
    (error) => Promise.reject(error)
  );

  // Response interceptor
  api.interceptors.response.use(
    (response) => {
      const { data, errorCode, redirectUrl } = response?.data || {};

      if (redirectUrl) {
        redirection(redirectUrl, errorCode);
      }
      if (data?.user) {
        store.dispatch(loginSuccess({ user: data.user, redirectUrl }));
      }
      return response;
    },
    (error) => {
      const { status, errorCode, redirectUrl } = error?.response?.data || {};

      if (redirectUrl) {
        redirection(redirectUrl, errorCode);
      }

      if (status === 401 || errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_LOGIN) {
        console.warn('Unauthorized - redirecting to login');
      } else if (status === 500) {
        console.error('Server error - please try again later');
      } else {
        console.error('Network error:', error.message);
      }

      return Promise.reject(error);
    }
  );
};

/**
 * Factory to create an Axios instance with optional headers and queries.
 */
export const createApiInstance = (
  baseURLKeyOrUrl?: BaseUrlType,
  headers: Record<string, string> = {},
  queries?: Array<Record<string, string>>
): AxiosInstance => {
  const selectedBaseURL = BASE_URLS[baseURLKeyOrUrl as keyof typeof BASE_URLS] || baseURLKeyOrUrl;

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  };

  const instance = axios.create({
    baseURL: selectedBaseURL,
    headers: Object.keys(headers).length ? headers : defaultHeaders,
  });

  attachInterceptors(instance, queries);

  return instance;
};
