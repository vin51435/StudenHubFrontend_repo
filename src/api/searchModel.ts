import { get } from "@src/libs/apiConfig";
import { ApiEndpointKey, BaseUrlType, IPaginatedResponse, IPaginationRequestQueries } from "@src/types";
import { debounce } from 'lodash';

/**
 * Searches for models using the provided endpoint and search term.
 *
 * @template T - The type of the items in the paginated response.
 * 
 * @param {BaseUrlType} BaseUrlType - The base URL to be used for the API request.
 * @param {ApiEndpointKey} endPoint - The endpoint to query for the models.
 * @param {IPaginationRequestQueries} searchTerm - The search queries to be used for filtering results.
 *
 * @returns {Promise<T[]>} The data from the paginated response.
 */
export const searchModel = debounce(async <T>(BaseUrlType: BaseUrlType, endPoint: ApiEndpointKey, searchTerm: IPaginationRequestQueries) => {
  const response = await get<IPaginatedResponse<T>>(endPoint, {
    BASE_URLS: BaseUrlType,
    queries: [searchTerm]
  })
  return response.data
}, 400);
