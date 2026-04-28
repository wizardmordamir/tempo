import { takeKey } from '../utils';

export const mapKey = (key: string) => (v: any[]) => v.map(takeKey(key));
