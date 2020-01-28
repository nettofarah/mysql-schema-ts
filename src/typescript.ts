export interface Column {
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

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function normalize(name: string): string {
  const reservedKeywords = ['string', 'number', 'package']
  let safename = name
  if (reservedKeywords.includes(name)) {
    safename = name + '_'
  }

  return safename
}

export function tableToTS(name: string, table: Table): string {
  const members = (withDefaults: boolean): string[] =>
    Object.keys(table).map(column => {
      const type = table[column].tsType
      const nullable = table[column].nullable ? '| null' : ''

      const hasDefault = table[column].hasDefault
      const defaultComment = hasDefault ? `Defaults to: ${table[column].defaultValue}.` : ''
      const comment = `${table[column].comment} ${defaultComment}`
      const tsComment = comment.trim().length > 0 ? `\n/** ${comment} */\n` : ''

      let isOptional = table[column].nullable
      if (withDefaults) {
        isOptional = isOptional || hasDefault
      }

      return `${tsComment}${normalize(column)}${isOptional ? '?' : ''}: ${type}${nullable}\n`
    })

  return `
    export interface ${capitalize(normalize(name))} {
    ${members(false)}
    }

    export interface ${capitalize(normalize(name))}WithDefaults {
    ${members(true)}
    }
  `.trim()
}
