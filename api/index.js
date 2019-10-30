const express = require('express')
const boolParser = require('express-query-boolean')

// Create express instnace
const app = express()
app.use(express.json())
app.use(boolParser())
app.use(express.urlencoded({ extended: false }))

const DB = require('./db')
const db = new DB()

// Require API routes
const tokenApi = require('./routes/token')
const dbApi = require('./db-api')

// Import API Routes
// app.use(tokenApi)
app.use(tokenApi(db))
app.use(dbApi(db, '/db'))

// // 404 - Route not found
app.use(function(req, res, next) {
  return res.status(404).json({ message: req.url })
})
//
// // 500 - Any server error
app.use(function(err, req, res, next) {
  return res.status(500).json({ error: err })
})

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app,
}
