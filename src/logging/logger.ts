import { getMessageFromError } from '../object';
import { safeStringify } from '../object/safeStringify';

export type LoggerLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'off';

export type LoggerConfig = {
  baseDirectory?: string;
  level: LoggerLevel;
  skipStringify?: boolean;
  stackDepth: number;
  stringifyError?: (_error: Error) => string;
  stringifyObject?: (_arg: any) => string;
  timestampFunction?: () => string;
  toggles: {
    // Made non-optional to simplify logic
    skipFileDetails: boolean;
    skipTimestamps: boolean;
  };
};

const validLevels: LoggerLevel[] = ['trace', 'debug', 'info', 'warn', 'error', 'off'];
const levelPriority = validLevels.reduce(
  (acc, lvl, i) => {
    acc[lvl] = i;
    return acc;
  },
  {} as Record<LoggerLevel, number>,
);

const loggerConfig: LoggerConfig = {
  level: 'info',
  stackDepth: 2,
  toggles: {
    skipFileDetails: false,
    skipTimestamps: false,
  },
};

export const getLoggerConfig = () => safeStringify(loggerConfig);
export const updateLoggerConfig = (config: Partial<LoggerConfig>) => {
  if (config.toggles) Object.assign(loggerConfig.toggles, config.toggles);
  return Object.assign(loggerConfig, { ...config, toggles: loggerConfig.toggles });
};

export const getFileDetails = (stackDepth?: number) => {
  if (loggerConfig.toggles.skipFileDetails) return '';

  const originalPrepare = Error.prepareStackTrace;
  // Temporary override to get structured data
  Error.prepareStackTrace = (_, stack) => stack;

  const err = new Error();
  const stack = (err.stack as unknown as any[]) || [];
  Error.prepareStackTrace = originalPrepare; // Restore immediately

  // 0: getFileDetails, 1: log, 2: logger method, 3: actual caller
  const depth = stackDepth ?? loggerConfig.stackDepth;
  const frame = stack[depth];

  if (!frame) return '';

  const fullPath = frame.getFileName() || '';
  const lineNumber = frame.getLineNumber();

  // Clean up path logic
  const pieces = fullPath.split('/');
  const sliceIndex = pieces.indexOf(loggerConfig.baseDirectory || process.cwd().split('/').pop() || '');
  const fileParts = sliceIndex !== -1 ? pieces.slice(sliceIndex + 1) : pieces.slice(-2);

  return `/${fileParts.join('/')}:${lineNumber}`;
};

const colors = {
  error: '\x1b[31m',
  warn: '\x1b[33m',
  info: '\x1b[34m',
  debug: '\x1b[36m',
  trace: '\x1b[90m',
};

const makeDefaultTimeStamp = () => new Date().toISOString().replace('T', ' ').replace(/\..+/, '');

const stringifyArgs = (args: any[]) => {
  if (loggerConfig.skipStringify) return args;
  return args.map((arg) => {
    if (arg instanceof Error) return loggerConfig.stringifyError?.(arg) ?? getMessageFromError(arg);
    if (typeof arg === 'object' && arg !== null) return loggerConfig.stringifyObject?.(arg) ?? safeStringify(arg);
    return String(arg);
  });
};

const log =
  (level: Exclude<LoggerLevel, 'off'>) =>
  (...args: any[]) => {
    // Priority check: only log if level is high enough
    if (levelPriority[level] < levelPriority[loggerConfig.level]) return;

    const prefix = `${colors[level]}[${level.toUpperCase()}]\x1b[0m`.padEnd(15);
    const timestamp = loggerConfig.toggles.skipTimestamps
      ? ''
      : (loggerConfig.timestampFunction?.() ?? makeDefaultTimeStamp());
    const details = getFileDetails();

    const message = stringifyArgs(args).join(' ');
    const header = `${prefix}${timestamp} ${details}`.trim();

    // Dynamically call console.error, console.warn, etc.
    const consoleMethod = level === 'trace' ? 'debug' : level;
    globalThis.console[consoleMethod](header, message);
  };

export const logger = {
  trace: log('trace'),
  debug: log('debug'),
  info: log('info'),
  warn: log('warn'),
  error: log('error'),
};
