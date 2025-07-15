import { flatEndpointObjects } from '@src/libs/apiEndpoints';
import { ApiEndpointKey } from '@src/types';

export const getApiEndpoint = (apiEndpoint: ApiEndpointKey | string): string => {
  return (flatEndpointObjects[apiEndpoint as ApiEndpointKey] as string) || apiEndpoint;
};

/**
 * Creates a new object with only the string-valued key-value pairs from the
 * original object.
 *
 * @param obj - The object to pick string endpoints from.
 * @returns A new object with only the string-valued key-value pairs.
 *
 * @example
 * const obj = {
 *   name: 'John',
 *   age: 42,
 *   website: 'https://example.com',
 * };
 * const result = pickStringEndpoints(obj);
 * // result = {
 * //   name: 'John',
 * //   website: 'https://example.com',
 * // };
 */
export function pickStringEndpoints(obj: Record<string, any>): Record<string, string> {
  const res: Record<string, string> = {};
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      res[key] = obj[key];
    }
  }
  return res;
}
