import { QueryArg } from './types';
import { createListOfSqlParams } from './util';

export type QueryType = [string] | [string, (string | QueryArg)[]];

export const insert = <T extends { [key: string]: any }>(entry: T, tableName: string): QueryType => {
  return insertMultiple([entry], tableName);
};

export const insertMultiple = <T extends { [key: string]: any }>(entries: T[], tableName: string): QueryType => {
  const filteredEntries = entries.map(entry => Object.entries(entry).filter(([key, value]) => key !== 'id' && !!value));
  const [first] = filteredEntries;
  const entryKeys = first.map(([key]) => key);
  const keys = `(${entryKeys.join(',')})`;
  const values = filteredEntries.reduce((acc, entry) => [...acc, ...entry.map(([, value]) => value)], []);

  const sqlParams = filteredEntries.map(() => `(${createListOfSqlParams(entryKeys.length)})`);
  return [`INSERT INTO ${tableName} ${keys} VALUES ${sqlParams.join(',')};`, values];
};

export const update = <T extends { id: number; [key: string]: any }>(entity: T, tableName: string): QueryType => {
  const filteredEntries = Object.entries(entity).filter(([key, value]) => key !== 'id' && !!value);
  const set = `${filteredEntries.map(([key]) => `${key}=?`).join()}`;
  const values = filteredEntries.map(([, value]) => value);

  return [`UPDATE ${tableName} SET ${set} WHERE id=${entity.id};`, values];
};

export const sqlTemplate = {
  insert,
  insertMultiple,
  update
};
