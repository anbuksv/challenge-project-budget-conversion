process.env.NODE_ENV = 'test'
require('../scripts/seed')
const http = require('http')
const test = require('tape')
const servertest = require('servertest')
const app = require('../lib/app')
const product1 = require('./stubs/product1')
const newProduct = require('./stubs/newProduct')
const updateProduct = require('./stubs/updateProduct')
const currencyStub = require('./stubs/currency')
const axios = require('axios').default

const server = http.createServer(app)

const postMethodConfig = { encoding: 'json', method: 'POST', headers: { 'Content-Type': 'application/json' } }

test('GET /health should return 200', function (t) {
  servertest(server, '/health', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.end()
  })
})

test('GET /api/ok should return 200', function (t) {
  servertest(server, '/api/ok', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.ok(res.body.ok, 'Should return a body')
    t.end()
  })
})

test('GET /nonexistent should return 404', function (t) {
  servertest(server, '/nonexistent', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 404, 'Should return 404')
    t.end()
  })
})

test('GET /api/project/budget/1  should return product', function (t) {
  servertest(server, '/api/project/budget/1', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.deepEqual(res.body, product1, 'Should return valid project')
    t.end()
  })
})

test('GET /api/project/budget/100001  should return valid error message', function (t) {
  servertest(server, '/api/project/budget/100001', { encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 500, 'Should return 500')
    t.deepEqual(res.body, { message: 'Project 100001 not found!' }, 'Should return valid project')
    t.end()
  })
})

test('POST /api/project/budget should add a product', function (t) {
  const req = servertest(server, '/api/project/budget', postMethodConfig, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.deepEqual(res.body, newProduct, 'Should return valid project')
    t.end()
  })
  req.write(JSON.stringify(newProduct))
  req.end()
})

test('PUT /api/project/budget/10001 should update a product', function (t) {
  const req = servertest(server, '/api/project/budget/10001', { ...postMethodConfig, method: 'PUT' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.deepEqual(res.body, { message: 'Project updated successfully' }, 'Should return valid project')
    t.end()
  })
  req.write(JSON.stringify(updateProduct))
  req.end()
})

test('DELETE /api/project/budget/10001 should update a product', function (t) {
  servertest(server, '/api/project/budget/10001', { method: 'DELETE', encoding: 'json' }, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.deepEqual(res.body, { message: 'Project deleted successfully' }, 'Should return valid project')
    t.end()
  })
})

test('POST /api/project/budget/currency should add a product', function (t) {
  const req = servertest(server, '/api/project/budget/currency', postMethodConfig, function (err, res) {
    t.error(err, 'No error')
    t.equal(res.statusCode, 200, 'Should return 200')
    t.deepEqual(res.body, currencyStub.response, 'Should return valid project')
    t.end()
  })
  axios.get = () => Promise.resolve({ data: currencyStub.exchangerRate })
  req.write(JSON.stringify(currencyStub.request))
  req.end()
})
