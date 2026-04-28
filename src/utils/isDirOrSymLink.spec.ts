import { fake, initializeGlobalMocks, resetAllMocks } from '../testing';

const mockManager = initializeGlobalMocks();

import { beforeEach, describe, expect, it } from 'bun:test';
import { isDirOrSymLink, isDirOrSymLinkSync } from './isDirOrSymLink';

describe('isDirOrSymLink', () => {
  // Ensure a clean slate before every test
  beforeEach(resetAllMocks);

  describe('Sync', () => {
    it('should return true for a directory', () => {
      fake('fs.lstatSync', {
        isDirectory: () => true,
        isSymbolicLink: () => false,
      });
      expect(isDirOrSymLinkSync('/path')).toBe(true);
    });

    it('should return true for a symlink', () => {
      fake('fs.lstatSync', { isSymbolicLink: () => true });
      expect(isDirOrSymLinkSync('/path')).toBe(true);
    });

    it('should return false for a regular file', () => {
      fake('fs.lstatSync', { isDirectory: () => false, isSymbolicLink: () => false });
      expect(isDirOrSymLinkSync('/path')).toBe(false);
    });

    it('should return false if lstatSync throws', () => {
      // Option A: Use your registry directly
      mockManager.registry.fs.lstatSync.mockImplementation(() => {
        throw new Error('Disk Failure');
      });

      expect(isDirOrSymLinkSync('/path')).toBe(false);
    });
  });

  describe('Async', () => {
    it('should return true for a directory', async () => {
      fake('fs.promises.lstat', { isDirectory: () => true });
      await expect(isDirOrSymLink('/path')).resolves.toBe(true);
    });

    it('should return true for a symlink', async () => {
      fake('fs.promises.lstat', { isSymbolicLink: () => true });
      await expect(isDirOrSymLink('/path')).resolves.toBe(true);
    });

    it('should return false if lstat rejects', async () => {
      mockManager.registry.fs.promises.lstat.mockImplementation(() => Promise.reject(new Error()));

      await expect(isDirOrSymLink('/path')).resolves.toBe(false);
    });
  });
});
