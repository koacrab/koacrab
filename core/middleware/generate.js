'use strict'
/**
 * 生成html
 */
const {
  resolve,
  join
} = require('path');
const config = require('../config/index.js');
// let cons = require('grace-consolidate');
// let engine = null;

module.exports = function() {
  return async function html(ctx, next) {
    if (ctx.render) return await next();

    ctx.html = (...rest) => {
      let file = '';
      let data = {};
      
      if(rest.length === 0){
        file = ctx.router['mod'] + '/' + ctx.router['ctr'];
      }

      if(rest.length === 1){
        file = ctx.router['mod'] + '/' + ctx.router['ctr'];
        data = rest[0];
      }

      if(rest.length === 2){
        file = rest[0];
        data = rest[1];
      }

      if(file.indexOf('.') === -1){
        file += '.' + config.nunjucksOpt.ext || '';
      }

      return new Promise((resolve, reject) => {
        // 把ctx注入到data里面
        let allData = Object.assign({}, ctx, data);
        env.render(file, allData, (error, result) => {
          if (error) {
            result = error.message;
          }

          ctx.type = mime['html'];
          ctx.body = result;

          resolve(result);
        })
      });
    };

    await next();
  }
};

function renderJson(ctx, data) {
  ctx.type = mime['json'];
  return ctx.body = data;
}

function renderText(ctx, data) {
  ctx.type = mime['text'];
  return ctx.body = data;
}

function renderSVG(ctx, data) {
  ctx.type = mime['svg'];
  return ctx.body = data;
}

function renderExcel(ctx, data, name = 'test') {
  let userAgent = (ctx.headers['user-agent']||'').toLowerCase();

  if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
    ctx.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(name) + '.xlsx');
  } else if(userAgent.indexOf('firefox') >= 0) {
    ctx.set('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(name)+'"' + '.xlsx');
  } else {
    /* safari等其他非主流浏览器只能自求多福了 */
    ctx.set('Content-Disposition', 'attachment; filename=' + new Buffer(name).toString('binary') + '.xlsx');
  }

  data = new Buffer(data,'binary');
  ctx.set('Content-Type', 'application/vnd.openxmlformats;charset=utf-8');
  // ctx.set("Content-Disposition", "attachment; filename*=" + `${name}.xlsx`);

  return ctx.body = data;
}

function renderWx(ctx, data) {
  if(ctx.wx){
    const ws = ctx.ws();
    ws.send(data);
  }else{
    return ctx.body = data;
  }
}
