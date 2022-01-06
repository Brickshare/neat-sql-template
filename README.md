# neat-mysql

A library to generate SQL templates in a neat way. Works well with either of:
g

- [neat-mysql](https://github.com/Brickshare/neat-mysql#readme)
- [mysql2](https://github.com/sidorares/node-mysql2#readme)

## Installation

```
npm i neat-sql-template
```

`neat-sql-template` has typescript typings out of the box.

## Usage

### Prepared statement using tag

```
import { SQL } from 'neat-sql-template';

const statement = SQL`
  UPDATE people SET name = ${'John'} WHERE id = ${1}
`;
// { sql: 'UPDATE people SET name = ? WHERE id = ?', values: ['John', 1] }

const concatenatedStatement = SQL`
  UPDATE people SET name = (${SQL`SELECT name from people WHERE id = ${2}`}) WHERE id = ${1}
`;
/*
  {
    sql: 'UPDATE people SET name = (SELECT name from people WHERE id = ?) WHERE id = ?;',
    values: [2, 1]
  }
*/

{
      statement: '\n' +
        'UPDATE people SET name = SELECT name from people WHERE id = ? WHERE id = ?\n',
      arguments: [ '2', '1' ]
    }

```

### Prepared statement using javascript objects

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

const findStatement = sqlTemplate.find({ id: 1 }, 'people');
/*
  {
    sql: 'SELECT * FROM people WHERE id = ?',
    values: [1]
  }
*/

const removeStatement = sqlTemplate.remove({ id: 1 }, 'people');
/*
  {
    sql: 'DELETE FROM people WHERE id = ?',
    values: [1]
  }
*/

```

### Prepared statement using mongodb-like API

```
const findStatement = find<Type>({ id: { $ne: 123 } }, 'table');
/*
  {
    sql: 'SELECT * FROM table WHERE id != ?',
    values: [123]
  }
*/

const findStatement = find<Type>({ id: { $ne: null } }, 'table');
/*
  {
    sql: 'SELECT * FROM table WHERE id IS NOT NULL',
    values: []
  }
*/

const deleteStatement = remove<Type>({ created_at: { $lt: new Date() } }, 'table');
/*
  {
    sql: 'DELETE FROM table WHERE created_at < ?',
    values: [Date(...)]
  }
*/

const findStatement = find<Type>({ name: { $unlike: 'name' } }, 'table');
/*
  {
    sql: 'SELECT * FROM table WHERE name NOT LIKE ?',
    values: ['name']
  }
*/

// explicit AND
const findStatement = find<Type>({
  $and: [{ id: 123 }, { name: 'name' }],
}, 'table');

/*
  {
    sql: 'SELECT * FROM table WHERE id = ? AND name = ?',
    values: [123, 'name']
  }
*/

// implicit AND
const findStatement = find<Type>({
  name: { $unlike: 'name' },
  id: { $ne: null }
}, 'table');

/*
  {
    sql: 'SELECT * FROM table WHERE name NOT LIKE ? AND id IS NOT NULL',
    values: ['name']
  }
*/

const findStatement = find<Type>({
  $or: [{ id: 123 }, { name: 'name' }],
}, 'table');

/*
  {
    sql: 'SELECT * FROM table WHERE id = ? OR name = ?',
    values: [123, 'name']
  }
*/

```
