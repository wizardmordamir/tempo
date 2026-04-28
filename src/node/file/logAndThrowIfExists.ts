import fs from 'node:fs';

export const logAndThrowIfExists = (path: string) => {
  if (fs.existsSync(path)) {
    console.log('path exists:', path);
    throw new Error(`path ${path} exists`);
  }
};
