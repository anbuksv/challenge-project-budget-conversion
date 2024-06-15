const express = require('express')
const projectEndpoints = require('./project/endpoint')

const endpoints = express.Router()

module.exports = endpoints

endpoints.get('/ok', (req, res) => {
  res.status(200).json({ ok: true })
})

endpoints.use('/project', projectEndpoints)
