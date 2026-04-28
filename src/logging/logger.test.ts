import { initializeGlobalMocks, resetAllMocks } from '../testing/registry';

const mockManager = initializeGlobalMocks();

import { beforeEach, describe, expect, it, mock } from 'bun:test';
import { logger, updateLoggerConfig } from '.';

describe('logger', () => {
  const mockISOString = 'mock-01-01T01:01:01.001Z';
  const mockISOStringParsed = 'mock-01-01 01:01:01';

  beforeEach(() => {
    resetAllMocks();
    // Reset Date to real one before each test if you mess with it
  });

  it('should not log if level is off', () => {
    updateLoggerConfig({ level: 'off' });
    logger.info('test');

    // Check call count via registry
    expect(mockManager.registry.console.info).toHaveBeenCalledTimes(0);
  });

  it('should log error with correct format', () => {
    updateLoggerConfig({ level: 'error' });
    // 1. Mock Date globally for this test
    const originalDate = global.Date;
    global.Date = mock(() => ({
      toISOString: () => mockISOString,
      getTimezoneOffset: () => 60000,
    })) as any;

    logger.error('test');

    expect(mockManager.registry.console.error).toHaveBeenCalledTimes(1);
    const callArgs = mockManager.registry.console.error.mock.calls[0].join(' ');

    expect(callArgs).toMatch(/\[ERROR\]/);
    expect(callArgs).toMatch(new RegExp(mockISOStringParsed));
    expect(callArgs).toMatch(/test/);

    global.Date = originalDate;
  });

  it('should automatically stringify objects', () => {
    const mockObj = { nest: { data: [1, 2, 3] } };
    const err = new Error('mock error');

    logger.error('test', mockObj, err);

    const callArgs = mockManager.registry.console.error.mock.calls[0].join(' ');

    expect(callArgs).toMatch(/mock error/);
    expect(callArgs).not.toMatch(/\[object Object\]/);
    // Verifies JSON stringification worked
    expect(callArgs).toMatch(/"data":\[1,2,3\]/);
  });
});
