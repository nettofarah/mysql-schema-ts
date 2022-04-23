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
    --defaults, -d Wheter to include insert interfaces with default values

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
      defaults: {
        type: 'boolean',
        alias: 'd',
        default: true
      }
    }
  }
)

const db = cli.input[0]
const { table, prefix, defaults } = cli.flags

async function main(): Promise<string> {
  if (table) {
    return inferTable(db, table, prefix, defaults)
  }

  return inferSchema(db, prefix, defaults)
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
