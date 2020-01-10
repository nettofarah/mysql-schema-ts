export interface Column {
  udtName: string
  nullable: boolean
  hasDefault: boolean
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
    const hasDefault = table[column].hasDefault
    const nullable = table[column].nullable ? '| null' : ''
    const comment = table[column].comment ? `\n/** ${table[column].comment} */\n` : ''

    const isOptional = hasDefault || nullable
    return `${comment}${normalize(column)}${isOptional ? '?' : ''}: ${type}${nullable}\n`
  })

  return `
    export interface ${normalize(name)} {
    ${members}
    }
  `.trim()
}
