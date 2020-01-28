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

function normalize(name: string): string {
  const reservedKeywords = ['string', 'number', 'package']
  if (reservedKeywords.includes(name)) {
    return name + '_'
  } else {
    return name
  }
}

export function tableToTS(name: string, table: Table): string {
  const members = Object.keys(table).map(column => {
    const type = table[column].tsType
    const nullable = table[column].nullable ? '| null' : ''

    const hasDefault = table[column].hasDefault
    const defaultComment = hasDefault ? `Defaults to: ${table[column].defaultValue}.` : ''
    const comment = `${table[column].comment} ${defaultComment}`
    const tsComment = comment.trim().length > 0 ? `\n/** ${comment} */\n` : ''

    const isOptional = nullable
    return `${tsComment}${normalize(column)}${isOptional ? '?' : ''}: ${type}${nullable}\n`
  })

  return `
    export interface ${normalize(name)} {
    ${members}
    }
  `.trim()
}
