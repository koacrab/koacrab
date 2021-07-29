'use strict'
/**
 * 代理中间件
 * https://zkeyword.com/post/request-promise/
 */

const request = require('request-promise');

module.exports = function() {
  return async function proxy(ctx, next) {
    if (ctx.proxy) return await next();

    ctx.proxy = function(p) {
      return new Promise((resolve, reject) => {
        let defaultParams = {
          method: 'GET',
          headers: {},
          body: {},
          url: ''
        };
        let options = Object.assign({}, defaultParams, p);

        request(options, (err, response, body) => {
          try {
            if (!err) {
              resolve(body);
            } else {
              console.error('middleware load data error: ', err, err.stack)
            }
          } catch (e) {
            console.error('proxy middleware load error: ', e)
          }
        });
      });
    };

    await next();
  }
}

function handleHeader(header) {
  if (!header) {
    return
  }
  for (var attr in header) {
    var trim = attr.trim()
    if (trim.toLowerCase() == 'content-length') {
      delete header[attr]
    } else if (trim != attr) {
      header[trim] = header[attr]
      delete header[attr]
    }
  }
  return header
}
