import { flatEndpointObjects } from '@src/libs/apiEndpoints';
import { ApiEndpointKey } from '@src/types';

export const getApiEndpoint = (apiEndpoint: ApiEndpointKey | string): string => {
  return (flatEndpointObjects[apiEndpoint as ApiEndpointKey] as string) || apiEndpoint;
};
