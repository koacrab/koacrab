'use strict';

const fs = require('fs');
const config = require('../config/middleware.js');

module.exports = function(app) {
  let filePath = '';
  let middleware = [];

  if (config) {
    for (let item in config) {
      filePath = `${item}.js`;

      if (config[item] && config[item]['status'] && fs.existsSync(__dirname + '/' + filePath)) {
        middleware.push(item);
        app.regMiddleware(require('./' + filePath));
      }
    }
  } else {
    fs.readdirSync(__dirname).forEach((item) => {
      filePath = `${item}.js`;

      if (config[item] && config[item]['status'] && fs.existsSync(__dirname + '/' + filePath)) {
        middleware.push(item);
        app.regMiddleware(require(filePath));
      }
    });
  }

  console.log(`本次运行依次加载了${middleware.length}个中间件，分别为：` + middleware);
};
