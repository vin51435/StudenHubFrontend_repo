import {
  AUTH_ENDPOINTS,
  BASE_URLS,
  BaseUrlType,
  flatEndpointObjects,
  FORMAT_ENDPOINTS,
  USER_ENDPOINTS,
} from '../libs/apiEndpoints';

export type BaseUrlType = keyof typeof BASE_URLS;

export type ApiEndpointKey = keyof typeof flatEndpointObjects;

export interface IMethodOptions {
  BASE_URLS?: BaseUrlType;
  data?: Record<string, any>;
  headers?: Record<string, any>;
  queue?: boolean;
  queries?: Record<string, any>[];
}

export interface IRequestQueue {
  apiCall: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export interface IResponseData<T = unknown> {
  data: T;
  email;
}

export interface IBaseResponse {
  status: string;
  message: string;
}

export interface IResponse<T = any> extends IBaseResponse {
  data?: IResponseData<T>;
  authenticated?: boolean;
  redirectUrl?: string;
}

export interface IPaginatedResponse<T = any> extends IBaseResponse {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
}
