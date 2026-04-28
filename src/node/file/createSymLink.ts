import fs from 'node:fs';
import path from 'node:path';
import { isExistingPath, removePathSync, tryOr } from '../../utils';
import { logAndThrowIfExists } from './logAndThrowIfExists';

export const createSymlinkSafe = ({ src, dest }: { src: string; dest: string }) => {
  tryOr(() => fs.symlinkSync(src, dest, 'junction'), false);
};

export const createSymlink = ({ src, dest }: { src: string; dest: string }) => {
  if (!path.isAbsolute(src)) {
    throw new Error(`Source directory ${src} is not absolute.`);
  }

  if (!isExistingPath(src)) {
    throw new Error(`Source directory ${src} does not exist.`);
  }

  removePathSync(dest);
  logAndThrowIfExists(dest);
  createSymlinkSafe({ src, dest });
};
