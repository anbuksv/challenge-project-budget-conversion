const config = require('../config')
const mysql = require('mysql')
const { withResolvers } = require('./util/withResolver')
const sqlite3 = require('sqlite3').verbose()

const engines = {
  undefined: 'sqlite3',
  test: 'sqlite3',
  development: 'mysql',
  production: 'mysql'
}

const engine = {
  sqlite3: new sqlite3.Database(':memory:'),
  mysql: mysql.createConnection(config.mysql)
}[engines[process.env.NODE_ENV]]

const db = module.exports = engine

const isMySQLEnvironment = engines[process.env.NODE_ENV] === 'mysql'

if (isMySQLEnvironment) {
  db.connect(function (err) {
    if (err) throw err
    console.log('connected to the database')
  })
}

db.healthCheck = function (cb) {
  const now = Date.now().toString()
  const createQuery = 'CREATE TABLE IF NOT EXISTS healthCheck (value TEXT)'
  const insertQuery = 'INSERT INTO healthCheck VALUES (?)'

  return executeQuery(createQuery, [], function (err) {
    if (err) return cb(err)
    return executeQuery(insertQuery, [now], function (err) {
      if (err) return cb(err)
      cb(null, now)
    })
  })
}

db.execute = function (query, values) {
  const [promise, resolve, reject] = withResolvers()

  executeQuery(query, values, (err, data) => {
    if (err) reject(err)
    resolve(data)
  })

  return promise
}

db.select = function (query, values) {
  if (isMySQLEnvironment) return db.execute(query, values)
  const [promise, resolve, reject] = withResolvers()
  db.serialize(function () {
    db.all(query, values, function (err, data) {
      if (err) return reject(err)
      resolve(data)
    })
  })
  return promise
}

function executeQuery (query, values, cb) {
  if (isMySQLEnvironment) {
    return db.query(query, values, function (err, data) {
      if (err) return cb(err)
      cb(null, data)
    })
  }

  return db.serialize(function () {
    db.run(query, values, function (err, data) {
      if (err) return cb(err)
      cb(null, data)
    })
  })
}
