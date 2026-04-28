import { curry } from '../flow';

/**
 * Sets a value at a given path in an object, creating nested objects as needed.
 * @param path - The dot-separated path string
 * @param value - The value to set
 * @param obj - The object to modify
 * @returns A new object with the value set at the path
 */
export const assocPath = curry(<T extends object>(path: string, value: any, obj: T): T => {
  if (!obj || typeof obj !== 'object') return obj;
  if (!path) return obj;

  const keys = path.split('.');
  const result = { ...obj };
  let current: any = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (current[key] === null || current[key] === undefined || typeof current[key] !== 'object') {
      current[key] = {};
    } else {
      current[key] = { ...current[key] };
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return result;
});
