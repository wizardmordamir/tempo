import { expect, jest, test, it, describe, beforeAll, afterAll, beforeEach, afterEach } from "bun:test";

Object.assign(globalThis, {
  expect,
  jest,
  test,
  it,
  describe,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
});

import { initializeGlobalMocks } from '../../src/testing';

const { mockManager } = initializeGlobalMocks();
mockManager.enable();
