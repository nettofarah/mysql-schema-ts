import { Table } from './typescript'
import { mapValues } from 'lodash'
import { Enums } from './mysql-client'

export function mapColumn(Table: Table, enumTypes: Enums): Table {
  return mapValues(Table, column => {
    switch (column.udtName) {
      case 'char':
      case 'varchar':
      case 'text':
      case 'tinytext':
      case 'mediumtext':
      case 'longtext':
      case 'time':
      case 'geometry':
      case 'set':
      case 'enum':
        // keep set and enum defaulted to string if custom type not mapped
        column.tsType = 'string'
        return column
      case 'integer':
      case 'int':
      case 'smallint':
      case 'mediumint':
      case 'bigint':
      case 'double':
      case 'decimal':
      case 'numeric':
      case 'float':
      case 'year':
        column.tsType = 'number'
        return column
      case 'tinyint':
        column.tsType = 'boolean'
        return column
      case 'json':
        column.tsType = 'Object'
        return column
      case 'date':
      case 'datetime':
      case 'timestamp':
        column.tsType = 'Date'
        return column
      case 'tinyblob':
      case 'mediumblob':
      case 'longblob':
      case 'blob':
      case 'binary':
      case 'varbinary':
      case 'bit':
        column.tsType = 'Buffer'
        return column
      default: {
        const name = column.udtName
        const enumType: string[] | undefined = enumTypes[name]
        column.tsType = enumType?.map(s => `'${s}'`).join(' | ') || 'any'
        return column
      }
    }
  })
}
