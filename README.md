# mysql-ts

> mysql-ts is a simple npm module you can use to convert a mysql schema into typescript interfaces

# Usage

```bash
# to infer an entire schema
$ npx mysql-ts mysql://root@localhost:3306/database

# to infer a specific table
$ npx mysql-ts mysql://root@localhost:3306/database table_name
```

tip: You can pipe the output of mysql-ts into a file with `npx mysql-ts <args> > schema.ts`

## Using `mysql-ts` programatically

```typescript
import { inferSchema, inferTable } from 'mysql-ts'

await inferSchema(connectionString)
await inferTable(connectionString, tableName)
```

## Design

mysql-ts is inpired by the awesome [schemats](https://github.com/SweetIQ/schemats) library.
But takes a simpler, more blunt, and configuration free approach:

- Simpler defaults
- MySQL support only
- Inline enums
- No support for namespaces

## License (MIT)

```
WWWWWW||WWWWWW
 W W W||W W W
      ||
    ( OO )__________
     /  |           \
    /o o|    MIT     \
    \___/||_||__||_|| *
         || ||  || ||
        _||_|| _||_||
       (__|__|(__|__|
```

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
