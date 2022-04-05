'use strict';

module.exports = {
  port: 1966,
  // 控制器的目录名称
  controllers: 'controllers',
  models: 'models',
  theme: 'theme',
  services: 'services',
  ctrName: 'ctr',
  actName: 'act',
  redis: {},
  mysql: {
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '123456',
    database: 'DBName',
    charset: 'utf8',
  },
  nunjucksOpt: {
    autoescape: true,
    ext: 'html',
    dev: true,
    trimBlocks: true, // 开启转义 防Xss
    // 防止跟vue的{{}}冲突
    tags: {
      blockStart: '<%',
      blockEnd: '%>',
      variableStart: '<$',
      variableEnd: '$>',
      commentStart: '<#',
      commentEnd: '#>'
    },
    minify: { removeComments: true, collapseWhitespace: true }
  },
  html: {
    dir: '/statics/'
  },
  wss: {
    port: 1967,
    noServer: true
  },
  statics: {
    // defer:true
  },
  errorEmail: {
    smtp: '',
    from: '',
    fromName: '',
    pwd: '',
    defaultEmail: '',
    subject: ''
  }
};
