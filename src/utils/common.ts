import ROUTES from "@src/routes/routes.config";

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
        .map(v => `'${v}'`)
        .join(' | ');
}