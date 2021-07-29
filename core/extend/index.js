'use strict';

const fs = require('fs');
const path = require('path');
const config = require('../config/extend.js');

module.exports = function(app) {
  let filePath = '';
  let extend = [];
  let children = {};

  if (config) {
    for (let item in config) {
      filePath = `${item}.js`;

      if (config[item] && config[item]['status'] && fs.existsSync(__dirname + '/' + filePath)) {
        extend.push(item);
        app.regExtend(item, require('./' + filePath));
      }
    }
  } else {
    fs.readdirSync(__dirname).forEach((item) => {
      filePath = `${item}.js`;

      if (config[item] && config[item]['status'] && fs.existsSync(__dirname + '/' + filePath)) {
        extend.push(item);
        app.regExtend(item, require(filePath));
      }
    });
  }

  // 获取项目的扩展
  let extendDir = process.cwd() + '/extend/';

  fs.readdirSync(extendDir).forEach(function(filename) {
    let baseName = path.basename(filename, '.js');
    let filePath = extendDir + "/" + filename;
    let stat = fs.statSync(filePath);
    let tempObj = {};

    if (stat && stat.isDirectory()) {
      children = children.concat(walk(filePath));
    } else {
      require(filePath)(app);
      // Object.assign(children, tempObj);
    }
  });



  console.log(`本次运行依次加载了${extend.length}个扩展，分别为：` + extend);
};
