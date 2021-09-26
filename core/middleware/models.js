'use strict'
/**
 * 模型中间件
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/index.js');

module.exports = function() {
  return function models(ctx, next) {
    // ctx.models = Object.assign(ctx, loadModel());
    ctx.models = loadModel();

    global.koacrab['models'] = ctx.models;

    return next();
  }
};

// 加载控制器
function loadModel() {
  // 模型缓存
  let models = {};
  let pathObj = readDirSync(process.cwd() + '/' + config.models || 'models');
  let tempObj = {};

  for (let item of Object.keys(pathObj)) {
    tempObj[item] = new (require(pathObj[item])); // 直接初始化
    // tempObj[item] = require(pathObj[item]);
    Object.assign(models, tempObj);
  }

  return models;
}

// 读取控制器目录
let children = {};

function readDirSync(dir, type) {
  fs.readdirSync(dir).forEach(function(filename) {
    let filePath = dir + "/" + filename;
    let stat = fs.statSync(filePath);
    let tempObj = {};

    if (stat && stat.isDirectory()) {
      readDirSync(filePath, filename);
    } else {
      let baseName = '';
      if (type) {
        baseName = type + '/' + path.basename(filename, '.js');
      } else {
        baseName = path.basename(filename, '.js');
      }

      tempObj[baseName] = filePath;
      Object.assign(children, tempObj);
    }
  });

  return children;
}
