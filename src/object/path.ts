import { type Curried, curry } from '../flow';

type Path<T> =
  T extends ReadonlyArray<infer V>
    ? `${number}` | `${number}.${Path<V>}`
    : T extends object
      ? {
          [K in keyof T]: K extends string | number
            ? T[K] extends object
              ? `${K}` | `${K}.${Path<T[K]>}`
              : `${K}`
            : never;
        }[keyof T]
      : never;

type PathValue<T, P extends string> = P extends `${infer Key}.${infer Rest}`
  ? Key extends keyof T
    ? PathValue<T[Key], Rest>
    : Key extends `${number}` // Handle array/numeric index
      ? T extends ReadonlyArray<infer V>
        ? PathValue<V, Rest>
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${number}`
      ? T extends ReadonlyArray<infer V>
        ? V
        : undefined
      : undefined;

// Define the base non-curried signature
type PathBase = <T extends object, P extends string>(pathStr: P, obj: T) => P extends Path<T> ? PathValue<T, P> : any;

export const path = curry(((pathStr: string, obj: object) => {
  if (obj === null || obj === undefined || !pathStr) return undefined;

  // Optimized split/lookup
  const keys = pathStr.split('.');
  let result: any = obj;

  for (const key of keys) {
    if (result == null) return undefined;
    // Security check
    if (key === '__proto__' || key === 'constructor') return undefined;
    result = result[key];
  }

  return result;
}) as any) as Curried<Parameters<PathBase>, ReturnType<PathBase>>;
