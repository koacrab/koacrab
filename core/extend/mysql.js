'use strict';

const debug = require('debug')('koacrab:h-mysql');
const config = require('../config/index.js');
const HMYSQL = require('h-mysql');
const als = require('../lib/als.js');

module.exports = function hMysql(app) {
  const instance = new HMYSQL(app.conf['mysql'] || config.mysql);

  const proxied = new Proxy(instance, {
    get(target, prop) {
      const originalValue = target[prop];
      // 直接拦截 execSql 和 query 方法
      if (prop === 'execSql' && typeof originalValue === 'function') {
        // 返回一个包装过的函数
        return async function(...args) {
          const store = als.getStore();
          // 将 store (ctx) 作为第一个参数
          args.unshift(store);
          return originalValue.apply(target, args);
        };
      }

      // 对于其他所有属性，直接返回
      return originalValue;
    }
  });

  proxied.getALS = () => als.getStore();
  app['mysql'] = proxied;
  return app;
};
