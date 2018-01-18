'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  /*TODO 需要放生成环境则修改成 production */
  NODE_ENV: '"development"'
})
