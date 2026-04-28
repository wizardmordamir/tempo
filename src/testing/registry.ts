import { type Mock, mock } from 'bun:test';

// Keep the internal logic exactly as you had it
const defaultMocks = {
  console: {
    log: () => undefined,
    error: () => undefined,
    warn: () => undefined,
    info: () => undefined,
  },
  fs: {
    promises: {
      access: () => Promise.resolve(),
      stat: () => Promise.resolve({ isSymbolicLink: () => false as boolean, isDirectory: () => false as boolean }),
      lstat: () => Promise.resolve({ isSymbolicLink: () => false as boolean, isDirectory: () => false as boolean }),
    },
    statSync: () => ({ isSymbolicLink: () => false as boolean, isDirectory: () => false as boolean }),
    lstatSync: () => ({ isSymbolicLink: () => false as boolean, isDirectory: () => false as boolean }),
    existsSync: () => false,
    readFileSync: () => '' as string,
    writeFileSync: () => undefined,
  },
};

const moduleMap: Record<string, string> = {
  fs: 'node:fs',
  console: 'node:console',
};

// --- Singleton Manager ---
class MockRegistry {
  private static instance: MockRegistry;
  private isEnabled = false;
  public registry: Registry;

  private constructor() {
    this.registry = this.createMockRegistry(defaultMocks) as Registry;
  }

  public static getInstance(): MockRegistry {
    if (!MockRegistry.instance) {
      MockRegistry.instance = new MockRegistry();
    }
    return MockRegistry.instance;
  }

  public createMockRegistry = (obj: any): any => {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => {
        if (typeof value === 'function') return [key, mock(value as any)];
        if (typeof value === 'object' && value !== null) return [key, this.createMockRegistry(value)];
        return [key, value];
      }),
    );
  };

  /**
   * Call this in your test setup or beforeAll to actually
   * trigger the Bun.mock.module interceptions.
   */
  public enable() {
    if (this.isEnabled) return;

    console.warn('🚨 [Registry] System Mocks Enabled: node:fs and console are now virtualized.');

    // 1. Intercept modules defined in moduleMap
    Object.entries(moduleMap).forEach(([registryKey, moduleName]) => {
      const mocks = (this.registry as any)[registryKey];
      if (!mocks) return;

      mock.module(moduleName, () => {
        const nested: Record<string, any> = {};
        for (const [key, value] of Object.entries(mocks)) {
          if (typeof value === 'object' && value !== null && !('_isMockFunction' in (value as any))) {
            nested[key] = value;
          }
        }
        return { ...mocks, ...nested, default: { ...mocks, ...nested } };
      });
    });

    // 2. Patch global console
    Object.assign(global.console, this.registry.console);

    this.isEnabled = true;
  }
}

let registry: Registry;
// --- Exported API ---
export const initializeGlobalMocks = () => {
  console.warn('Intiializing Global Mocks - globals like console will be mocked');
  const mockManager = MockRegistry.getInstance();
  registry = mockManager.registry;
  return {
    mockManager,
    registry,
  };
};

/**
 * UPDATED fake: Uses the singleton registry
 */
export const fake = (path: string, overrides: any) => {
  const segments = path.split('.');
  const mockFunc = segments.reduce((obj, key) => obj?.[key], registry) as any;
  const defaultGetter = segments.reduce((obj, key) => obj?.[key], defaultMocks) as any;

  if (!mockFunc || !defaultGetter) {
    throw new Error(`[Registry] Path ${path} not found.`);
  }

  const implementation = (...args: any[]) => {
    const base = defaultGetter(...args);
    if (base instanceof Promise) {
      return base.then((resolvedBase) => deepMerge(resolvedBase, overrides));
    }
    return deepMerge(base, overrides);
  };

  mockFunc.mockImplementation(implementation);
};

export const fakeReject = (path: string, error: any = new Error('Mocked Error')) => {
  const mockFunc = path.split('.').reduce((obj, key) => obj?.[key], registry) as any;
  mockFunc.mockImplementation(() => Promise.reject(error));
};

export const resetAllMocks = (currentRegistry: any = registry, currentDefaults: any = defaultMocks) => {
  for (const key in currentRegistry) {
    const item = currentRegistry[key];
    const defaultValue = currentDefaults[key];
    if (item?._isMockFunction || (typeof item === 'function' && 'mockImplementation' in item)) {
      item.mockClear();
      item.mockImplementation(defaultValue);
    } else if (typeof item === 'object' && item !== null) {
      resetAllMocks(item, defaultValue);
    }
  }
};

// --- Helper Functions (Private) ---

const deepMerge = (base: any, overrides: any): any => {
  if (typeof overrides !== 'object' || overrides === null || typeof overrides === 'function') return overrides;
  const result = { ...base };
  for (const key in overrides) {
    if (overrides[key] && typeof overrides[key] === 'object' && typeof overrides[key] !== 'function') {
      result[key] = deepMerge(base[key] || {}, overrides[key]);
    } else {
      result[key] = overrides[key];
    }
  }
  return result;
};

type DeepMocked<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? Mock<T[K]> : T[K] extends object ? DeepMocked<T[K]> : T[K];
};
type Registry = DeepMocked<typeof defaultMocks>;
