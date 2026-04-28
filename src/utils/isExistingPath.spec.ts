import { fake, initializeGlobalMocks, resetAllMocks } from '../testing';

const mockManager = initializeGlobalMocks();

import { beforeEach, describe, expect, it } from 'bun:test';
import { isExistingPath, isExistingPathSync } from './isExistingPath';

describe('isExistingPath', () => {
  // 1. Clear every mock in the registry before each test
  beforeEach(resetAllMocks);

  describe('Sync', () => {
    it('should return true for an existing path', () => {
      fake('fs.existsSync', true);
      expect(isExistingPathSync('/path/to/directory')).toBe(true);
    });

    it('should return false for a missing path', () => {
      fake('fs.existsSync', false);
      expect(isExistingPathSync('/path/to/file')).toBe(false);
    });

    it('should return false if an error occurs', () => {
      // For throws, use the registry directly
      mockManager.registry.fs.existsSync.mockImplementation(() => {
        throw new Error('Error');
      });
      expect(isExistingPathSync('/path/to/nonexistent')).toBe(false);
    });
  });

  describe('Async', () => {
    it('should return true if access resolves', async () => {
      // Mocking access (which usually resolves with undefined on success)
      mockManager.registry.fs.promises.access.mockResolvedValue(undefined);

      await expect(isExistingPath('/path/to/directory')).resolves.toBe(true);
    });

    it('should return false if access rejects (e.g., ENOENT)', async () => {
      mockManager.registry.fs.promises.access.mockRejectedValue(new Error('ENOENT'));

      await expect(isExistingPath('/path/to/file')).resolves.toBe(false);
    });

    it('should return false if a generic error occurs', async () => {
      mockManager.registry.fs.promises.access.mockRejectedValue(new Error('Some other error'));

      await expect(isExistingPath('/path/to/nonexistent')).resolves.toBe(false);
    });
  });
});
