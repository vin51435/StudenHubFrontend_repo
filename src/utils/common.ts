import ROUTES from '@src/routes/routes.config';

/**
 * Recursively extracts all unique values for a specified key (e.g., 'name' or 'path')
 * from a nested object array and returns them as a TypeScript union type string.
 *
 * @template T - The type of the input object
 * @param key - The key to extract values from (e.g., 'name', 'path').
 * @param data - The nested object array.
 * @returns A string representing a TypeScript union type (e.g., `'LOGIN' | 'SIGNUP'`)
 *
 * @example
 * const result = generateNestedUnionTypeFromKey('name', ROUTES);
 * // => `'WEBSITE' | 'AUTH' | 'LOGIN' | 'CALLBACK' | 'GOOGLE' | 'GITHUB'`
 */
export type ExtractKeyValues<T, K extends string> = T extends readonly any[]
  ? ExtractKeyValues<T[number], K>
  : T extends object
  ? K extends keyof T
    ? T[K] | (T extends { children: any } ? ExtractKeyValues<T['children'], K> : never)
    : T extends { children: any }
    ? ExtractKeyValues<T['children'], K>
    : never
  : never;

/**
 * Recursively searches through an array of nested objects to find an object
 * with a specified key-value pair. Optionally, a key for children arrays can
 * be provided to search through nested structures.
 *
 * @param obj - The array of objects to search through.
 * @param key - The key to match against the specified value.
 * @param value - The value to search for.
 * @param childrenKey - Optional key that indicates where nested child arrays exist.
 * @returns The first object that matches the key-value pair, or undefined if not found.
 */
export function searchArrayNestedObjByKey<T extends Record<string, any>>(
  obj: T[],
  key: string,
  value: string,
  childrenKey?: string
): T | undefined {
  for (const item of obj) {
    if (item?.[key] === value) {
      return item;
    }
    if (childrenKey && item?.[childrenKey]) {
      const found = searchArrayNestedObjByKey(item[childrenKey], key, value, childrenKey);
      if (found) return found as T;
    }
  }
  return undefined;
}

export function updateNestedArrayById<T extends Record<string, any>>(
  items: T[],
  key: string,
  keyValue: string,
  updater: (item: T) => T,
  childrenKey: string = 'children'
): T[] | null {
  let found = false;

  const updated = items.map((item) => {
    if (item[key] === keyValue) {
      found = true;
      return updater({ ...item });
    } else if (item[childrenKey]) {
      const updatedChildren = updateNestedArrayById(
        item[childrenKey],
        key,
        keyValue,
        updater,
        childrenKey
      );
      if (updatedChildren !== null) {
        found = true;
        return { ...item, [childrenKey]: updatedChildren };
      }
    }
    return item;
  });

  return found ? updated : null;
}

export const flattenMenuItems = <T extends Record<string, any>>(
  items: T[],
  parentKey?: string
): (T & { parentKeys: string[] })[] => {
  return items.flatMap((item) => {
    const parentKeys = parentKey ? [parentKey] : [];
    const current: T & { parentKeys: string[] } = {
      ...item,
      parentKeys,
    };

    if (item.children) {
      return [
        current,
        ...flattenMenuItems(item.children, item.key).map((child) => ({
          ...child,
          parentKeys: [...parentKeys, item.key],
        })),
      ];
    }

    return [current];
  }) as (T & { parentKeys: string[] })[];
};

/**
 * Groups an array of objects by the specified key. If the `name` parameter is provided,
 * the group names will be overwritten with the provided value.
 *
 * @param {T[]} array The array of objects to group.
 * @param {string} key The key to group by.
 * @param {string} [name] The name to overwrite the group names with.
 * @returns {Record<string, T[]>} A record with the group names as keys and an array of objects as values.
 *
 * @example
 * const array = [
 *   { id: 1, type: 'A', name: 'John' },
 *   { id: 2, type: 'B', name: 'Jane' },
 *   { id: 3, type: 'A', name: 'Bob' },
 * ];
 *
 * const result = groupArrayOfObjects(array, 'type');
 * // result = {
 * //   A: [{ id: 1, type: 'A', name: 'John' }, { id: 3, type: 'A', name: 'Bob' }],
 * //   B: [{ id: 2, type: 'B', name: 'Jane' }],
 * // };
 *
 */
export const groupArrayOfObjects = <T extends Record<string, any>>(
  array: T[],
  key: string,
  name?: string
): Record<string, T[]> => {
  return array.reduce((acc, item) => {
    let group = item[key];
    if (!group) return acc;
    if (name) group = name;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(item);
    return acc;
  }, {} as Record<string, T[]>);
};

/**
 * Matches a route pattern against a given pathname, allowing for parameterized segments.
 *
 * @param route - The route pattern to match, which can include parameterized segments prefixed with ':'.
 * @param pathname - The pathname to match against the route pattern.
 * @returns The value of the matching parameterized segment if a match is found; otherwise, null.
 *
 * @example
 * matchRoute('/user/:id', '/user/123') // returns '123'
 * matchRoute('/user/:id', '/user') // returns null
 * matchRoute('/user', '/user/123') // returns null
 */
export const matchRoute = (route: string, pathname: string) => {
  const routeParts = route.split('/');
  const pathnameParts = pathname.split('/');

  if (routeParts.length !== pathnameParts.length) return null;

  for (let i = 0; i < routeParts.length; i++) {
    if (routeParts[i].startsWith(':')) {
      return pathnameParts[i];
    } else if (routeParts[i] !== pathnameParts[i]) {
      return null;
    }
  }

  return null;
};
