import { curry } from '../flow';
import { path } from '../object';

interface Without {
  // Full application: without(vals, key, arr)
  <T>(vals: unknown[], deepKey: string, arr: T[]): T[];

  // Partial application (1 arg): without(vals)
  (
    vals: unknown[],
  ): {
    <T>(deepKey: string, arr: T[]): T[];
    (deepKey: string): <T>(arr: T[]) => T[];
  };

  // Partial application (2 args): without(vals, key)
  (vals: unknown[], deepKey: string): <T>(arr: T[]) => T[];
}

export const without = curry(((vals: unknown[], deepKey: string, arr: any[]): any[] => {
  if (!Array.isArray(arr)) return [];
  if (!Array.isArray(vals) || vals.length === 0) return [...arr];

  const valsSet = new Set(vals);
  const getValue = deepKey ? (item: any) => path(deepKey, item) : (item: any) => item;

  return arr.filter((item) => !valsSet.has(getValue(item)));
}) as any) as unknown as Without;
