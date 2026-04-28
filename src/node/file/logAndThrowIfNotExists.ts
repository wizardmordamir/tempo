import fs from 'node:fs';

export const logAndThrowIfNotExists = (path: string) => {
  if (!fs.existsSync(path)) {
    console.log('path does not exist:', path);
    throw new Error(`path ${path} does not exist`);
  }
};
