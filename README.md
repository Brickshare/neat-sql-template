# neat-mysql

A library to generate SQL templates in a neat way. Works well with either of:

- [neat-mysql](https://github.com/Brickshare/neat-mysql#readme)
- [mysql2](https://github.com/sidorares/node-mysql2#readme)

## Installation

```
npm i neat-sql-template
```

`neat-sql-template` has typescript typings out of the box.

## Usage

### Template using tag

```
import { SQL } from 'neat-sql-template';

const statement = SQL`
  UPDATE people SET name = ${'John'} WHERE id = ${1}
`;
// { sql: 'UPDATE people SET name = ? WHERE id = ?', values: ['John', 1] }


```

### Template using javascript objects

```
import { sqlTemplate } from 'neat-sql-template';

const people = [
  { name: 'John', email: 'john@mail.com' },
  { name: 'Tim', email: 'tim@mail.com' },
  { name: 'Benjamin', email: 'ben@mail.com' },
]

const insertStatement = sqlTemplate.insert(people[0], 'people');
/*
  {
    sql: 'INSERT INTO people (name, email) VALUES (?, ?);',
    values: ['John', 'john@mail.com']
  }
*/

const insertMultipleStatement = sqlTemplate.insertMultiple(people, 'people');
/*
  {
    sql: 'INSERT INTO people (name, email) VALUES (?, ?), (?, ?), (?, ?);',
    values: ['John', 'john@mail.com', 'Tim', 'tim@mail.com', 'Benjamin', 'ben@mail.com']
  }
*/

const updateStatement = sqlTemplate.update({ ...people[0], id: 1 }, 'people');
/*
  {
    sql: 'UPDATE people SET name = ?, email = ? WHERE id = ?',
    values: ['John', 'john@mail.com', 1]
  }
*/

```
