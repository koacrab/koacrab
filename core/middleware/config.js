'use strict'
/**
 * 模型中间件
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/index.js');

module.exports = function() {
  return function config(ctx, next) {
    let conf = loadConf(process.cwd());
    ctx.config = Object.assign({}, config, conf);

    return next();
  }
};

// 加载配置文件
function loadConf(dir) {
  let children = {};
  let dirs = dir + '/config/'

  fs.readdirSync(dirs).forEach(function(filename) {
    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext !== 'js') {
      return;
    }
    let baseName = path.basename(filename, '.config.js');
    let filePath = dirs + "/" + filename;
    let stat = fs.statSync(filePath);
    let tempObj = {};

    if (stat && stat.isDirectory()) {
      children = children.concat(walk(filePath));
    } else {
      tempObj[baseName] = require(filePath);
      Object.assign(children, tempObj);
    }
  });

  return children;
}
