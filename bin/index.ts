#!/usr/bin/env node
import { inferSchema, inferTable } from '../src'
import meow from 'meow'

const cli = meow(
  `
	Usage
	  $ mysql-schema-ts <input>

	Options
    --table, -t  Table name
    --prefix, -p Prefix to add to table names
    --schema-name, -s Overrides name of the database schema

	Examples
	  $ mysql-schema-ts --prefix SQL
`,
  {
    flags: {
      table: {
        type: 'string',
        alias: 't'
      },
      prefix: {
        type: 'string',
        alias: 'p',
        default: ''
      },
      schemaName: {
        type: 'string',
        alias: 's',
        default: ''
      }
    }
  }
)

const db = cli.input[0]
const { table, prefix, schemaName } = cli.flags

async function main(): Promise<string> {
  if (table) {
    return inferTable(db, table, prefix)
  }

  return inferSchema(db, schemaName ? schemaName : null, prefix)
}

main()
  .then(code => {
    process.stdout.write(code)
    process.exit(0)
  })
  .catch(err => {
    console.error(err)
    process.exit(1)
  })
