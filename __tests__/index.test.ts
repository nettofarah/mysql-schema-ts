import { createConnection } from 'mysql'
import { query } from '../src/mysql-client'
import { inferTable, inferSchema } from '../src'
import { SQL as sql } from 'sql-template-strings'

const connectionString = 'mysql://root@localhost:3306/test'
const conn = createConnection(connectionString)

const agreements = sql`
  CREATE TABLE IF NOT EXISTS agreements (                 
    id varbinary(24) NOT NULL,              
    billing_plan_id varbinary(24) NOT NULL, 
    category varbinary(24) NOT NULL,        
    name varbinary(64) NOT NULL,            
    PRIMARY KEY (id)                        
)`

const requests = sql`
  CREATE TABLE IF NOT EXISTS requests (
    id int(11) NOT NULL,
    name varchar(255) NOT NULL,
    url varchar(255) NOT NULL,
    integration_type enum('source','destination') NOT NULL
  )
`

const complex = sql`
  CREATE TABLE IF NOT EXISTS complex (
    id varbinary(255) NOT NULL,
    name varchar(255) NOT NULL,
    nullable varchar(255),
    created_at timestamp,
    created_on date NOT NULL
  )
`

beforeAll(async () => {
  await query(conn, agreements)
  await query(conn, requests)
  await query(conn, complex)
})

describe('inferTable', () => {
  it('infers a table', async () => {
    const code = await inferTable(connectionString, 'agreements')
    expect(code).toMatchInlineSnapshot(`
      "export interface agreements {
        id: Buffer
        billing_plan_id: Buffer
        category: Buffer
        name: Buffer
      }
      "
    `)
  })

  it('works with enums', async () => {
    const code = await inferTable(connectionString, 'requests')
    expect(code).toMatchInlineSnapshot(`
      "export interface requests {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }
      "
    `)
  })

  it('works with complex types', async () => {
    const code = await inferTable(connectionString, 'complex')
    expect(code).toMatchInlineSnapshot(`
      "export interface complex {
        id: Buffer
        name: string
        nullable: string | null
        created_at: Date
        created_on: Date
      }
      "
    `)
  })
})

describe('inferSchema', () => {
  it('infers all tables at once', async () => {
    const code = await inferSchema(connectionString)
    expect(code).toMatchInlineSnapshot(`
      "export interface agreements {
        id: Buffer
        billing_plan_id: Buffer
        category: Buffer
        name: Buffer
      }
      export interface complex {
        id: Buffer
        name: string
        nullable: string | null
        created_at: Date
        created_on: Date
      }
      export interface requests {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }
      "
    `)
  })
})
