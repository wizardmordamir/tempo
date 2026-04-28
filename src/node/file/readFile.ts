import { eitherA } from '../../utils';
import { fileExists } from './fileExists';
import { readFileUnsafe } from './readFileUnsafe';

export const readFile = eitherA(fileExists, readFileUnsafe, false);
