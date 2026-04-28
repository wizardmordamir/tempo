export const getMissingKeys = <T extends object>(obj: T, keys: (keyof T)[]): (keyof T)[] => {
  return keys.filter((key) => !(key in obj));
};

export const throwIfMissingKeys = <T extends object>(obj: T, keys: (keyof T)[]): void => {
  const missingKeys = getMissingKeys(obj, keys);
  if (missingKeys.length > 0) {
    throw new Error(`Missing keys: ${missingKeys.join(', ')}`);
  }
};

export const allKeysExist = <T extends object>(obj: T, keys: (keyof T)[]): boolean => {
  return keys.every((key) => key in obj);
};
