import axios, { AxiosInstance } from 'axios';
import store from '../redux/store';
import { loginSuccess, setRedirectUrl } from '../redux/reducers/auth';
import { BASE_URLS } from './apiEndpoints';
import { BaseUrlType, IErrorResponse, RequestBodyType } from '../types';
import { ErrorCodes } from '@src/contants/errorCodes';
import { getRoutePath } from '@src/utils/getRoutePath';
import { setLoading } from '@src/redux/reducers/uiSlice';

function redirection(redirectUrl: string, errorCode?: string) {
  store.dispatch(setLoading(true));
  let redirectPath: string = redirectUrl;

  if (
    (errorCode === ErrorCodes.CLIENT.UNAUTHENTICATED ||
      errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_LOGIN) &&
    (window.location.pathname === getRoutePath('LOGIN') ||
      window.location.pathname === getRoutePath('SIGNUP'))
  ) {
    return;
  }

  if (errorCode === ErrorCodes.CLIENT.UNAUTHENTICATED) {
    redirectPath = getRoutePath('LOGIN');
  } else if (errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_DETAILS) {
    redirectPath = getRoutePath('SIGNUP.DETAILS');
  } else if (errorCode === ErrorCodes.SIGNUP.REDIRECT_TO_INTERESTS) {
    redirectPath = getRoutePath('SIGNUP.INTERESTS');
  }

  if (redirectPath && window.location.pathname !== redirectPath) {
    window.location.href = redirectPath;
  }
  store.dispatch(setRedirectUrl(redirectPath));
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

      if (data?.user) {
        store.dispatch(loginSuccess({ user: data.user }));
      }

      if (redirectUrl) {
        redirection(redirectUrl, errorCode);
      }
      return response;
    },
    (error) => {
      const errorData = error?.response?.data as IErrorResponse;
      const { status, statusCode, errorCode, redirectUrl } = errorData || {};

      console.error('Error:', error.message);

      if (redirectUrl) {
        redirection(redirectUrl, errorCode);
      }

      return Promise.reject(errorData);
    }
  );
};

/**
 * Factory to create an Axios instance with optional headers and queries.
 */
export const createApiInstance = (
  baseURLKeyOrUrl?: BaseUrlType,
  bodyType: RequestBodyType = 'json',
  queries?: Array<Record<string, string>>
): AxiosInstance => {
  const selectedBaseURL = BASE_URLS[baseURLKeyOrUrl as keyof typeof BASE_URLS] || baseURLKeyOrUrl;

  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420',
  };

  if (bodyType === 'form-data') {
    headers['Content-Type'] = 'multipart/form-data';
  }

  const instance = axios.create({
    baseURL: selectedBaseURL,
    headers,
  });

  attachInterceptors(instance, queries);

  return instance;
};
