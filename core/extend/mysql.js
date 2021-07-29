'use strict';

const debug = require('debug')('koacrab:h-mysql')
const config = require('../config/index.js');
const HMYSQL = require('h-mysql');

module.exports = function hMysql(app) {
  app['mysql']= new HMYSQL(app.conf['mysql'] || config.mysql);

  return app;
};
