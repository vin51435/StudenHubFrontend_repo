import { get } from '@src/libs/apiConfig';
import {
  ApiEndpointKey,
  BaseUrlType,
  IPaginatedResponse,
  IPaginationRequestQueries,
} from '@src/types';

async function _searchModel<T = any>(
  BaseUrlType: BaseUrlType,
  endPoint: ApiEndpointKey | string,
  searchTerm: IPaginationRequestQueries
): Promise<IPaginatedResponse<T>> {
  const response = await get<{}, IPaginatedResponse<T>>(endPoint, {
    BASE_URLS: BaseUrlType,
    queries: [searchTerm],
  });
  return response;
}

export const searchModel = _searchModel;
