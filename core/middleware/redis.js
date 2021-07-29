'use strict'
/**
 * redis
 */

const session = require('koa-generic-session');
const redisStore = require('koa-redis');

module.exports = function() {
  return async function redis(ctx, next) {
    if (ctx.httpProxy) return await next();

    ctx.redis = function(url) {
      return new Promise((resolve, reject) => {

      });
    };

    await next();
  }
}
