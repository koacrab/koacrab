'use strict'
/**
 * 模型中间件
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/index.js');
// const debug = require('debug')('koacrab:services');

module.exports = function () {
  return function services(ctx, next) {

    // ctx.services = Object.assign(ctx, loadServices());
    ctx.services = loadServices(ctx);

    global.koacrab['services'] = ctx.services;

    return next();
  }
};

// 加载控制器
function loadServices(ctx) {
  // 模型缓存
  let services = {};
  let pathObj = readDirSync(process.cwd() + '/' + config.services || 'services');
  let tempObj = {};

  // 实例化
  // for (let item of Object.keys(pathObj)) {
  //   try {

  //     // tempObj[item] = new (require(pathObj[item]));
  //     tempObj[item] = require(pathObj[item]);
  //     if(typeof tempObj[item] === 'function'){
  //       tempObj[item] = new tempObj[item](ctx);
  //     }
  //     Object.assign(services, tempObj);
  //   } catch (err) {
  //     debug('services：' + item, err);
  //   }
  // }

  for (let item of Object.keys(pathObj)) {
    // tempObj[item] = require(pathObj[item]);
    try {
      tempObj[item] = new (require(pathObj[item]));
      Object.assign(services, tempObj);
    } catch (err) {
      console.log(`加载service模块：${item} 错误：`, err)
    }
  }

  return services;
}

// 读取控制器目录
let children = {};

function readDirSync(dir, type) {
  fs.readdirSync(dir).forEach(function (filename) {
    let filePath = dir + "/" + filename;
    let stat = fs.statSync(filePath);
    let tempObj = {};

    if (stat && stat.isDirectory()) {
      readDirSync(filePath, filename);
    } else {
      let ext = filename.substring(filename.lastIndexOf('.' + 1));
      if (ext !== 'js') {
        return;
      }
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
