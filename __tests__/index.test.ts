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

const withJSON = sql`
  CREATE TABLE IF NOT EXISTS table_with_json (                 
    id varbinary(24) NOT NULL,              
    data json DEFAULT NULL,
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
    created_on date NOT NULL,
    documented_field varchar(255) COMMENT "This is an awesome field"
  )
`

beforeAll(async () => {
  await query(conn, agreements)
  await query(conn, requests)
  await query(conn, complex)
  await query(conn, withJSON)
})

describe('inferTable', () => {
  it('infers a table', async () => {
    const code = await inferTable(connectionString, 'agreements')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.0.0
      */

      export interface agreements {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }
      "
    `)
  })

  it('works with enums', async () => {
    const code = await inferTable(connectionString, 'requests')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.0.0
      */

      export interface requests {
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
      "/**
       Schema Generated with mysql-schema-ts 1.0.0
      */

      export interface complex {
        id: string
        name: string
        nullable?: string | null
        created_at?: Date
        created_on: Date
        /** This is an awesome field */
        documented_field?: string | null
      }
      "
    `)
  })

  it('works with JSON', async () => {
    const code = await inferTable(connectionString, 'table_with_json')
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.0.0
      */

      export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export interface JSONArray extends Array<JSONValue> {}

      export interface table_with_json {
        id: string
        data?: JSONValue | null
      }
      "
    `)
  })
})

describe('inferSchema', () => {
  it('infers all tables at once', async () => {
    const code = await inferSchema(connectionString)
    expect(code).toMatchInlineSnapshot(`
      "/**
       Schema Generated with mysql-schema-ts 1.0.0
      */

      export type JSONPrimitive = string | number | boolean | null
      export type JSONValue = JSONPrimitive | JSONObject | JSONArray
      export type JSONObject = { [member: string]: JSONValue }
      export interface JSONArray extends Array<JSONValue> {}

      export interface agreements {
        id: string
        billing_plan_id: string
        category: string
        name: string
      }
      export interface complex {
        id: string
        name: string
        nullable?: string | null
        created_at?: Date
        created_on: Date
        /** This is an awesome field */
        documented_field?: string | null
      }
      export interface requests {
        id: number
        name: string
        url: string
        integration_type: 'source' | 'destination'
      }
      export interface table_with_json {
        id: string
        data?: JSONValue | null
      }
      "
    `)
  })
})
