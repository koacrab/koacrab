'use strict';
const als = require('../lib/als.js');
const crypto = require('crypto');

module.exports = function() {
  return function context(ctx, next) {
    // 为每个请求生成一个唯一的追踪ID
    const traceId = crypto.randomUUID();
    
    // 将其附加到 ctx 上，方便后续中间件直接使用
    ctx.traceId = traceId;

    // 初始化性能统计对象
    ctx.perfStats = {
      dbQueries: 0,
      dbDuration: 0,
    };

    // 运行异步本地存储，将整个 ctx (现在包含了traceId) 存入
    return als.run(ctx, () => {
      return next();
    });
  }
};