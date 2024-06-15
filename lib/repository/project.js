const db = require('../db')
const queryHelper = require('../util/queryHelper')

module.exports = {
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
  getProjectByYearAndName
}

async function getProjectById (id) {
  const selectSql = 'SELECT * FROM project where projectId = ?'
  const results = await db.select(selectSql, id)
  if (!results || results.length === 0) throw new Error(`Project ${id} not found!`)
  return results[0]
}

async function addProject (project) {
  const { columns, placeholders, values } = queryHelper.toInsertStatement(project)
  const insertSql = `INSERT INTO project (${columns}) VALUES (${placeholders})`
  await db.execute(insertSql, values)
  return project
}

async function updateProject (projectId, project) {
  const { assignments, values } = queryHelper.toUpdateStatement(project)
  const updateSql = `UPDATE project SET ${assignments} where projectId=?`
  values.push(projectId)
  await db.execute(updateSql, values)
  return { message: 'Project updated successfully' }
}

async function deleteProject (projectId) {
  const deleteSql = 'DELETE FROM project WHERE projectId=?'
  await db.execute(deleteSql, [projectId])
  return { message: 'Project deleted successfully' }
}

async function getProjectByYearAndName (year, projectName) {
  const selectSql = 'SELECT * FROM project WHERE year = ? AND projectName LIKE ?'
  const results = await db.select(selectSql, [year, projectName])
  return results || []
}
