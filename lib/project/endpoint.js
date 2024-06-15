const express = require('express')
const { handler } = require('../util/handler')
const { getProjectByIdHandler, addProjectHandler, updateProjectHandler, deleteProjectHandler } = require('./budget')
const { currencyHandler } = require('./currency')
const projectEndpoints = express.Router()

module.exports = projectEndpoints

projectEndpoints.get('/budget/:id', handler(getProjectByIdHandler))
projectEndpoints.post('/budget', handler(addProjectHandler))
projectEndpoints.put('/budget/:id', handler(updateProjectHandler))
projectEndpoints.delete('/budget/:id', handler(deleteProjectHandler))

projectEndpoints.post('/budget/currency', handler(currencyHandler))
