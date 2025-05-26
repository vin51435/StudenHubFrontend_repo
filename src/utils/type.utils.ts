export type DeepFlatten<T> = T extends object ? { [K in keyof T]: DeepFlatten<T[K]> }[keyof T] : T;
