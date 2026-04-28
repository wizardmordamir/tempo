import fs from 'node:fs';

export const isDirOrSymLinkSync = (path: string): boolean => {
  console.log(fs.lstatSync.toString());
  try {
    const stats = fs.lstatSync(path);
    return stats.isDirectory() || stats.isSymbolicLink();
  } catch {
    return false;
  }
};

export const isDirOrSymLink = async (path: string): Promise<boolean> => {
  try {
    const stats = await fs.promises.lstat(path);
    return stats.isDirectory() || stats.isSymbolicLink();
  } catch {
    return false;
  }
};
