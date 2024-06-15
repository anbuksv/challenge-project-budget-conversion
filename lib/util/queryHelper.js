const queryHelper = {
  toInsertStatement,
  toUpdateStatement
}

module.exports = queryHelper

function toInsertStatement (data) {
  const columns = Object.keys(data).join(', ')
  const placeholders = Object.keys(data).map(() => '?').join(', ')
  const values = Object.values(data)
  return { columns, placeholders, values }
}

function toUpdateStatement (data) {
  const assignments = Object.keys(data).map(key => `${key} = ?`).join(', ')
  const values = Object.values(data)
  return { assignments, values }
}
