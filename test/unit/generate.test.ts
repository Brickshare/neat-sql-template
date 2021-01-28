import { sqlTemplate } from '@src/generate';

const { insert, insertMultiple, update } = sqlTemplate;

describe('insert', () => {
  test(`returns insert statement as tuple from input object`, async () => {
    expect(insert({ a: 'a', b: 2 }, 'table')).toEqual([`INSERT INTO table (a,b) VALUES (?,?);`, ['a', 2]]);
  });
});

describe('insertMultiple', () => {
  test(`returns insert statements as tuple from array of objects`, async () => {
    expect(insertMultiple([{ a: 'a', b: 2 }], 'table')).toEqual([`INSERT INTO table (a,b) VALUES (?,?);`, ['a', 2]]);
    const statement = insertMultiple(
      [
        { a: 'a', b: 2 },
        { a: 'c', b: 5 }
      ],
      'table'
    );
    expect(statement).toEqual([`INSERT INTO table (a,b) VALUES (?,?),(?,?);`, ['a', 2, 'c', 5]]);
  });
});

describe('update', () => {
  test(`returns insert statements as tuple from array of objects`, async () => {
    const statement = update({ id: 1, a: 'a', b: 2 }, 'table');
    expect(statement).toEqual([`UPDATE table SET a=?,b=? WHERE id=1;`, ['a', 2]]);
  });
});
