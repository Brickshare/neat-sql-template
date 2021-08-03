import { QueryArg, SQLTemplate } from './types';
import { createListOfSqlParams } from './util';

export type QueryType = [string] | [string, (string | QueryArg)[]];

export const insert = <T extends { [key: string]: any }>(
  entry: T,
  tableName: string,
  includeId = false,
): SQLTemplate => {
  return insertMultiple([entry], tableName, includeId);
};

export const insertMultiple = <T extends { [key: string]: any }>(
  entries: T[],
  tableName: string,
  includeId = false,
): SQLTemplate => {
  const filteredEntries = entries.map(entry =>
    Object.entries(entry).filter(([key, value]) => (key !== 'id' || includeId) && value !== undefined),
  );

  const [first] = filteredEntries;
  const entryKeys = first.map(([key]) => key);
  const keys = `(${entryKeys.join(',')})`;
  const values = filteredEntries.reduce((acc, entry) => [...acc, ...entry.map(([, value]) => value)], []);

  const sqlParams = filteredEntries.map(() => `(${createListOfSqlParams(entryKeys.length)})`);
  return {
    sql: `INSERT INTO ${tableName} ${keys} VALUES ${sqlParams.join(',')};`,
    values,
  };
};

export const update = <T extends { id: number | string; [key: string]: any }>(
  entity: T,
  tableName: string,
): SQLTemplate => {
  const { id } = entity;
  const filteredEntries = Object.entries(entity).filter(([key, value]) => key !== 'id' && !!value);
  const set = `${filteredEntries.map(([key]) => `${key} = ?`).join(', ')}`;
  const values = filteredEntries.map(([, value]) => value);

  return {
    sql: `UPDATE ${tableName} SET ${set} WHERE id = ${typeof id === 'string' ? `"${id}"` : id};`,
    values,
  };
};

export const find = (query: Record<string, any>, tableName: string) => {
  return {
    sql: `SELECT * FROM ${tableName} WHERE ${Object.keys(query)
      .map(key => `${key} = ?`)
      .join(' AND ')};`,
    values: Object.values(query),
  };
};

export const remove = (query: Record<string, any>, tableName: string) => {
  return {
    sql: `DELETE FROM ${tableName} WHERE ${Object.keys(query)
      .map(key => `${key} = ?`)
      .join(' AND ')};`,
    values: Object.values(query),
  };
};

export const sqlTemplate = {
  insert,
  insertMultiple,
  update,
  find,
  remove,
};
