import { QueryArg } from './types';
import sqlstring from 'sqlstring';

const SQL_PARAM_CHAR: string = '?';
export function createListOfSqlParams(count: number): string {
  return count <= 0 ? '' : [...SQL_PARAM_CHAR.repeat(count)].join(',');
}

export const formatSQL = (sql: string, args: QueryArg[] = []): string => sqlstring.format(sql, args);
