const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  PARSE_URI: '"http://localhost:1337/parse"',
  PARSE_APP_ID: '"COURIER_ADMIN"',
  PARSE_JAVASCRIPT_KEY: '"your_cool_js_key"',
  PARSE_MASTER_KEY: '"care_for_your_master_key"',
  BASE_URL: '""'
})
