import { type Curried, curry } from '../flow/curry';
import { isEmpty } from '../is/isEmpty';

// 1. Internal implementation with type safety
const fn = (path: string[], obj: any): any => {
  if (isEmpty(path)) return obj;

  const [property, ...rest] = path;

  // Use Object.hasOwn for safety against prototype pollution
  return obj && Object.hasOwn(obj, property) ? fn(rest, obj[property]) : undefined;
};

// 2. Export with your Curried helper
export const getValue = curry(fn, 2) as Curried<[string[], object], any>;
