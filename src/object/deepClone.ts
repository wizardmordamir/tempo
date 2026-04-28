import type { Obj } from '../types';

export const deepClone = (obj: Obj): Obj => structuredClone(obj);
