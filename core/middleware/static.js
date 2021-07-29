'use strict'
const staticCache = require('koa-static-cache');
const statics = require('koa-static');
const config = require('../config/index.js');
/**
 * 日志中间件
 */
/*console.log(typeof staticCache({
  dir: '/theme/home/',
  dynamic: true,
}));
module.exports = staticCache;
*/

module.exports = function() {
  // return async function statics(ctx, next) {
    return statics(process.cwd() + '/public/', config.statics || {});
  // }
}

