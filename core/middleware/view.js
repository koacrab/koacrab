'use strict'
/**
 * 模板中间件
 */
const nunjucks = require('nunjucks');
const minify = require('html-minifier').minify;
const {
  resolve,
  join
} = require('path');
const config = require('../config/index.js');
// let cons = require('grace-consolidate');
// let engine = null;
const mime = {
  text: 'text/plain',
  html: 'text/html',
  json: 'application/json',
  svg: 'image/svg+xml;charset=utf-8',
  xml: 'application/xml'
};


module.exports = function() {
  return async function view(ctx, next) {
    if (ctx.render) return await next();

    ctx.renderJson = function(data) {
      return renderJson(ctx, data);
    };

    ctx.renderText = function(data) {
      return renderText(ctx, data);
    };

    ctx.renderExcel = function(data, name) {
      return renderExcel(ctx, data, name);
    };

    ctx.renderCsv = function(csvUrl, name) {
      return renderCsv(ctx, csvUrl, name);
    };

    ctx.renderSVG = function(data, name) {
      return renderSVG(ctx, data, name);
    };

    ctx.renderWx = function(data) {
      return renderWx(ctx, data);
    };

    ctx.renderHtml = function(data) {
      return renderHtml(ctx, data);
    };

    ctx.renderRedirect = function(url, type = 'back') {
      return ctx.redirect(url, type);
    };

    ctx.renderXml = function(data) {
      return renderXml(ctx, data);
    };

    let options = config.nunjucksOpt || {};

    let env = nunjucks.configure(process.cwd() + '/' + config.theme || 'theme', options);

    ctx.render = (...rest) => {
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
          // 压缩HTML
          result = minify(result, options.minify);
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

function renderCsv(ctx, csvUrl, name = 'export') {
  let userAgent = (ctx.headers['user-agent']||'').toLowerCase();

  if(userAgent.indexOf('msie') >= 0 || userAgent.indexOf('chrome') >= 0) {
    ctx.set('Content-Disposition', 'attachment; filename=' + encodeURIComponent(name) + '.csv');
  } else if(userAgent.indexOf('firefox') >= 0) {
    ctx.set('Content-Disposition', 'attachment; filename*="utf8\'\'' + encodeURIComponent(name)+'\'"' + '.csv');
  } else {
    /* safari等其他非主流浏览器只能自求多福了 */
    ctx.set('Content-Disposition', 'attachment; filename=' + new Buffer(name).toString('binary') + '.csv');
  }

  ctx.set('Content-Type', 'text/csv;charset=utf-8');
  // 重定向到CSV文件URL进行下载
  ctx.redirect(csvUrl);
}

function renderWx(ctx, data) {
  if(ctx.wx){
    const ws = ctx.ws();
    ws.send(data);
  }else{
    return ctx.body = data;
  }
}

function renderXml(ctx, data) {
  ctx.type = mime['xml'];
  return ctx.body = data;
}
// 渲染原生的HTML
function renderHtml(ctx, data) {
  ctx.type = mime['html'];
  return ctx.body = data;
}
