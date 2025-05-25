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
export function generateNestedUnionTypeFromKey<T extends Record<string, any>>(
  key: string,
  data: any = ROUTES
): string {
  const values = new Set<string>();

  function recurse(items: T[]) {
    for (const item of items) {
      if (key in item && typeof item[key] === 'string') {
        values.add(item[key]);
      }
      if (Array.isArray(item.children)) {
        recurse(item.children);
      }
    }
  }

  recurse(data);

  return Array.from(values)
    .map((v) => `'${v}'`)
    .join(' | ');
}

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
      const found = searchArrayNestedObjByKey(item?.[childrenKey], key, value, childrenKey);
      if (found) return found as T;
    }
  }
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
