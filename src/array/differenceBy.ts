import { curry } from '../flow';
import { path } from '../object';

type DifferenceBy = {
  <T, V>(deepKey: string): (arrToCompare: T[]) => (vals: V[]) => V[];
  <T, V>(deepKey: string, arrToCompare: T[]): (vals: V[]) => V[];
  <T, V>(deepKey: string, arrToCompare: T[], vals: V[]): V[];
};

export const differenceBy = curry((deepKey: string = '', arrToCompare: any[], vals: any[]) => {
  const extractedValues =
    deepKey && deepKey.trim() !== '' ? arrToCompare.map((item) => path(deepKey, item)) : arrToCompare;

  const compareSet = new Set(extractedValues);
  return vals.filter((val) => !compareSet.has(val));
}, 3) as unknown as DifferenceBy;

export const difference = differenceBy('');
