'use strict'
/**
 * 工具中间件
 */
const fs = require('fs');
const path = require('path');

module.exports = function() {
  return function utils(ctx, next) {
    ctx = Object.assign(ctx, loadUtils(ctx));

    return next();
  }
};

// 加载控制器
function loadUtils(ctx) {
  // 控制器缓存
  let utils = {};
  let pathObj = walk(process.cwd() + '/libs/');
  let tempObj = {};

  for (let item of Object.keys(pathObj)) {
    if(ctx.hasOwnProperty(item)){
      console.warn(`提示：文件名'${item}'已经被使用，请重新更改文件名，文件的路径：`, pathObj[item]);
      continue;
    }

    tempObj[item] = require(pathObj[item]);
    Object.assign(utils, tempObj);
  }

  return utils;
}

function walk(dir) {
  let children = {};

  fs.readdirSync(dir).forEach(function(filename) {
    let baseName = path.basename(filename, '.js');
    let filePath = dir + "/" + filename;
    let stat = fs.statSync(filePath);
    let tempObj = {};

    if (stat && stat.isDirectory()) {
      children = children.concat(walk(filePath));
    } else {
      tempObj[baseName] = filePath;
      Object.assign(children, tempObj);
    }
  });

  return children
}
