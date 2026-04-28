import { fake, initializeGlobalMocks } from '../testing';

const mockManager = initializeGlobalMocks();

import { describe, expect, it } from 'bun:test';
import { isSymLink, isSymLinkSync } from './isSymLink';

describe('isSymLinkSync', () => {
  it('should return true for a symbolic link (sync)', () => {
    fake('fs.lstatSync', {
      isSymbolicLink: () => true,
    });

    expect(isSymLinkSync('/some/path')).toBe(true);
  });

  it('should return false for a non-symbolic link (sync)', async () => {
    fake('fs.lstatSync', {
      isSymbolicLink: () => false,
    });

    expect(isSymLinkSync('/path/to/file')).toBe(false);
  });

  it('should return false if an error occurs (sync)', async () => {
    mockManager.registry.fs.promises.lstat.mockRejectedValue(new Error('Error'));

    expect(isSymLinkSync('/path/to/nonexistent')).toBe(false);
  });
});

describe('isSymLink', () => {
  it('should return true for a directory (async)', async () => {
    fake('fs.promises.lstat', {
      isSymbolicLink: () => true,
    });

    await expect(isSymLink('/path/to/directory')).resolves.toBe(true);
  });

  it('should return false for non-symbolic links (async)', async () => {
    fake('fs.promises.lstat', () => ({
      isSymbolicLink: () => false,
    }));

    await expect(isSymLink('/path/to/file')).resolves.toBe(false);
  });

  it('should return false if an error occurs (async)', async () => {
    mockManager.registry.fs.promises.lstat.mockRejectedValue(new Error('Error'));

    await expect(isSymLink('/path/to/nonexistent')).resolves.toBe(false);
  });
});
