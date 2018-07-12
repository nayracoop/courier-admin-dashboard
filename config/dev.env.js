'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PARSE_URI: '"https://develop.nayra.coop/ca-parse/parse"',
  PARSE_APP_ID: '"COURIER_ADMIN"',
  PARSE_JAVASCRIPT_KEY: '"***REMOVED***"',
  PARSE_MASTER_KEY: '"***REMOVED***"'
})
