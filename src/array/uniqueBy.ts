import { curry } from '../flow';
import { path } from '../object';

const _uniqueBy = <T extends object>(deepKey: string, arr: T[]): T[] => {
  if (!Array.isArray(arr)) return [];

  const seen = new Set<unknown>();

  // Create the getter once outside the filter for performance.
  // We cast to 'any' here because 'deepKey' is a general string,
  // but path wants a specific 'Path<T>'.
  const getter = path(deepKey as any);

  return arr.filter((item) => {
    if (!item) return false;

    const val = getter(item);

    if (seen.has(val)) return false;

    seen.add(val);
    return true;
  });
};

export const uniqueBy = curry(_uniqueBy as any) as unknown as {
  <T extends object>(deepKey: string, arr: T[]): T[];
  (deepKey: string): <T extends object>(arr: T[]) => T[];
};
