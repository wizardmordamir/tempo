import { mergeObjects } from '../object';
import { makeMockLogger } from './makeMockLogger';

export const makeMockApp = (options = {}) =>
  mergeObjects(
    {
      locals: {
        config: {} as any,
        logger: makeMockLogger(),
      },
    },
    options,
  );
