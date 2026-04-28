import fs from 'node:fs';
import { tryOr, tryOrAsync } from './tryOr';

// export const isSymLinkSync = (path: string): boolean => {
//   const stats = fs.lstatSync(path);
//   console.log('**** stats:', stats);
//   const isSym = stats.isSymbolicLink();
//   console.log('**** isSym:', isSym);
//   return isSym;
// };

export const isSymLinkSync = (path: string): boolean => {
  return tryOr(() => fs.lstatSync(path).isSymbolicLink(), false);
};

export const isSymLink = async (path: string): Promise<boolean> => {
  return tryOrAsync(() => fs.promises.lstat(path).then((stats) => stats.isSymbolicLink()), false);
};
