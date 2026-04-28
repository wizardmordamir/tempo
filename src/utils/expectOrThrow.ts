import { isString } from '../is';

export const expectOrThrow = (evaluater, message?) => (value) => {
  if (!evaluater(value)) {
    const errorMessage = typeof message === 'function' ? message(value) : message;
    throw new Error(
      `${errorMessage || 'expect failed'}, value: ${isString(value) ? value : JSON.stringify(value, null, 2)}`,
    );
  }
  return value;
};
