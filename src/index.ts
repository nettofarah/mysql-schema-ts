import { tableToTS, Table, schemaToTS } from './typescript'
import { MySQL } from './mysql-client'
import prettier from 'prettier'
import pkg from '../package.json'

function pretty(code: string): string {
  return prettier.format(code, {
    parser: 'typescript',
    ...pkg.prettier
  })
}

const JSONHeader = `
export type JSONPrimitive = string | number | boolean | null;
export type JSONValue = JSONPrimitive | JSONObject | JSONArray;
export type JSONObject = { [member: string]: JSONValue };
export type JSONArray = Array<JSONValue>
`

const header = (includesJSON: boolean): string => `
/**
 Schema Generated with ${pkg.name} ${pkg.version}
*/

${includesJSON ? JSONHeader : ''}
`

export async function inferTable(connectionString: string, table: string, prefix = ''): Promise<string> {
  const db = new MySQL(connectionString)
  const code = tableToTS(table, prefix, await db.table(table))
  const fullCode = `
    ${header(code.includes('JSON'))}
    ${code}
  `
  return pretty(fullCode)
}

export async function inferSchema(
  connectionString: string,
  schemaName: string | null = null,
  prefix = ''
): Promise<string> {
  const db = new MySQL(connectionString)
  const tables = await db.allTables()
  const interfaces = tables.map(table => tableToTS(table.name, prefix, table.table))
  const code = [
    header(interfaces.some(i => i.includes('JSON'))),
    ...interfaces,
    schemaToTS(schemaName ?? `${db.databaseName}Schema`, prefix, tables)
  ].join('\n\n')
  return pretty(code)
}

export async function inferTableObject(connectionString: string, table: string): Promise<Table> {
  const db = new MySQL(connectionString)
  return db.table(table)
}

export async function inferSchemaObject(connectionString: string): Promise<{ name: string; table: Table }[]> {
  const db = new MySQL(connectionString)
  const tables = await db.allTables()
  return tables
}
