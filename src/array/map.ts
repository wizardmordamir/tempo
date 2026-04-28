import { curry } from '../flow/curry';

/**
 * map: (fn, arr) -> newArr
 */
export const map = curry(<T, R>(fn: (arg: T) => R, arr: T[]): R[] => {
  return arr.map(fn);
});
