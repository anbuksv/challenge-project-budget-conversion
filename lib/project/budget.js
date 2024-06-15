const projectRepository = require('../repository/project')

module.exports = {
  getProjectByIdHandler,
  addProjectHandler,
  updateProjectHandler,
  deleteProjectHandler
}

async function getProjectByIdHandler (req, res) {
  const project = await projectRepository.getProjectById(req.params.id)
  res.json(project)
}

async function addProjectHandler (req, res) {
  const results = await projectRepository.addProject(req.body)
  res.json(results)
}

async function updateProjectHandler (req, res) {
  const results = await projectRepository.updateProject(req.params.id, req.body)
  res.json(results)
}

async function deleteProjectHandler (req, res) {
  const results = await projectRepository.deleteProject(req.params.id)
  res.json(results)
}
