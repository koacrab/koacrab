'use strict'
/**
 * 控制器中间件
 */
const fs = require('fs');
const path = require('path');
const config = require('../config/index.js');

module.exports = function () {
  return function controllers(ctx, next) {
    ctx.controller = loadController();

    ctx.isGet = isGet(ctx);
    ctx.isPost = isPost(ctx);

    return next();
  }
};

// 加载控制器
function loadController() {
  // 控制器缓存
  let controllers = {};
  let pathObj = readDirSync(process.cwd() + '/' + config.controllers || 'controllers');
  let tempObj = {};

  for (let item of Object.keys(pathObj)) {
    // tempObj[item] = new (require(pathObj[item]));
    tempObj[item] = require(pathObj[item]);
    Object.assign(controllers, tempObj);
  }

  return controllers;
}

// 读取控制器目录
let children = {};

function readDirSync(dir, type) {
  fs.readdirSync(dir).forEach(function (filename) {
    let ext = filename.substring(filename.lastIndexOf('.') + 1);
    if (ext !== 'js') {
      return;
    }
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

function isGet(ctx) {
  return ctx.request.method === 'GET' || false;
}

function isPost(ctx) {
  return ctx.request.method === 'POST' || false;
}

