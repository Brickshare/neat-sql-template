import { createListOfSqlParams } from '@src/util';
import 'jest';

describe('createListOfSqlParams', () => {
  it(`should return empty string if count is 0`, () => {
    expect(createListOfSqlParams(0)).toBe('');
  });

  it(`should return a number of '?' characters`, () => {
    expect(createListOfSqlParams(5)).toBe('?,?,?,?,?');
  });
});
