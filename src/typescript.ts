import camelcase from 'camelcase'

export interface Column {
  position: number
  udtName: string
  nullable: boolean
  hasDefault: boolean
  defaultValue: string | null
  comment: string | null
  tsType?: string
}

export interface Table {
  [columnName: string]: Column
}

function camelize(s: string): string {
  return camelcase(s, { pascalCase: true })
}

function normalize(name: string): string {
  const reservedKeywords = ['string', 'number', 'package']
  let safename = name
  if (reservedKeywords.includes(name)) {
    safename = name + '_'
  }

  return safename
}

export function tableToTS(name: string, prefix: string, table: Table): string {
  const members = (withDefaults: boolean): string[] =>
    Object.keys(table)
      .sort((a, b) => table[a].position - table[b].position)
      .map(column => {
        const type = table[column].tsType
        const nullable = table[column].nullable ? '| null' : ''
        const defaultComment = table[column].defaultValue ? `Defaults to: ${table[column].defaultValue}.` : ''
        const comment = `${table[column].comment} ${defaultComment}`
        const tsComment = comment.trim().length > 0 ? `\n/** ${comment} */\n` : ''

        let isOptional = table[column].nullable
        if (withDefaults) {
          isOptional = isOptional || table[column].hasDefault
        }

        return `${tsComment}${normalize(column)}${isOptional ? '?' : ''}: ${type}${nullable}\n`
      })

  const tableName = (prefix || '') + camelize(normalize(name))

  return `
    /**
     * Exposes all fields present in ${name} as a typescript
     * interface.
    */
    export interface ${tableName} {
    ${members(false)}
    }

    /**
     * Exposes the same fields as ${tableName},
     * but makes every field containing a DEFAULT value optional.
     *
     * This is especially useful when generating inserts, as you
     * should be able to ommit these fields if you'd like
    */
    export interface ${tableName}WithDefaults {
    ${members(true)}
    }
  `.trim()
}
