import { curry } from '../flow';
import { path } from '../object';

/**
 * pluck: (key) => (arr) => values[]
 */
export const pluck = curry(((key: string, arr: any[]): any[] => {
  if (!Array.isArray(arr)) {
    return [];
  }

  // 1. Path first, Object second
  // 2. Pre-curry the getter for better performance across the map
  const getter = path(key as any);

  return arr.map((item) => getter(item));
}) as any) as unknown as {
  <T>(key: string, arr: T[]): any[];
  (key: string): <T>(arr: T[]) => any[];
};
