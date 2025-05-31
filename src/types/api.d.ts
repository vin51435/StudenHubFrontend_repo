import { DeepFlatten } from '@src/utils/type.utils';
import {
  AUTH_ENDPOINTS,
  BASE_URLS,
  BaseUrlType,
  flatEndpointObjects,
  FORMAT_ENDPOINTS,
  USER_ENDPOINTS,
} from '../libs/apiEndpoints';
import { ErrorCodes } from '@src/contants/errorCodes';

export type BaseUrlType = keyof typeof BASE_URLS;

export type ApiEndpointKey = keyof typeof flatEndpointObjects;

export type RequestBodyType = 'json' | 'form-data';

export interface IMethodOptions {
  BASE_URLS?: BaseUrlType;
  data?: Record<string, any>;
  bodyType?: RequestBodyType;
  headers?: Record<string, any>;
  queue?: boolean;
  queries?: Record<string, any>[];
}

export interface IRequestQueue {
  apiCall: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
}

export interface IBaseResponse {
  statusCode: number;
  status: string;
  message: string;
  redirectUrl?: string;
  errorCode?: DeepFlatten<typeof ErrorCodes>;
}

export interface IResponse<T = any> extends IBaseResponse {
  data?: T;
  authenticated?: boolean;
}

export type DefaultProjectionType = Record<string, '0' | '1'>;
export type SortOrder = 'asc' | 'desc';

export interface IPaginationRequestQueries<T = any> extends ParsedQs {
  page?: string;
  pageSize?: string;
  selectFields?: string;
  sortOrder?: SortOrder;
  sortField?: string;
  projection?: string;
  populateFields?: string;
  defaultProjection?: DefaultProjectionType;
  searchValue?: string;
  searchFields?: string[] | string;
  excludeIds?: string | string[]; // optional: to exclude some _id values
  ids?: string | string[];
  [key: string]: any;
}

export interface IPaginatedResponse<T = any> extends IBaseResponse {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  hasMore: boolean;
}

export interface IErrorResponse extends IBaseResponse {}
