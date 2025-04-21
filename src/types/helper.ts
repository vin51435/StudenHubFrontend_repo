/**
 * This type is used to generate a union type of all the nested paths of an object.
 * It is used to generate a type that can be used to access any nested property of an object.
 * For example, if you have an object with the following structure:
 * {
 *   a: {
 *     b: {
 *       c: string
 *     }
 *   }
 * }
 * The type DeepPaths<typeof object> would be "a.b.c".
 * @template T The type of the object to generate the paths for.
 */
export type DeepPaths<T> = T extends string ? T : { [K in keyof T]: DeepPaths<T[K]> }[keyof T];
