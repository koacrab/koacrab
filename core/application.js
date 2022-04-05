/***
 *      _  __                    ___                    _
 *     | |/ /    ___    __ _    / __|     _ _   __ _   | |__
 *     | ' <    / _ \  / _` |  | (__     | '_| / _` |  | '_ \
 *     |_|\_\   \___/  \__,_|   \___|   _|_|_  \__,_|  |_.__/
 *    _|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|
 *    "`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'
 */

// http://patorjk.com/software/taag/#p=testall&c=c&f=Graffiti&t=KoaCrab
const Koa = require('koa');
const path = require('path');
const http = require('http');
const fs = require('fs');
const debug = require('debug')('koacrab');
const convert = require('koa-convert');
const lodash = require('lodash');
const config = require('./config/index.js');
const pkg = require('../package.json');
// const log = require('./log.js');
const middleware = require('./middleware/index.js');
const extend = require('./extend/index.js');
const color = require('cli-color');
const statics = require('koa-static');
const helps = require('./tools/utils');

module.exports = class Application extends Koa {
  constructor() {
    super();

    global.koacrab = pkg;

    this.middlewares = [];
    this.ext = {};
    this.koacrab = koacrab.koa = new Koa();

    // this.koacrab.proxy = true;
    // 项目运行的根路径
    this.root = process.cwd();
    this.conf = this.loadConf(this.root);
    this.port = this.conf.port || config.port;
    this.conf.errorEmail = Object.assign({}, config.errorEmail, this.conf.errorEmail);

    // 全局配置文件
    koacrab.conf = this.conf;
  }

  init() {
    this.errors();

    // 把默认的中间件注册到系统里
    middleware(this);
    // 把扩展注册到系统里
    extend(this);

    for (let item of this.middlewares) {
      this.use(item(this));
    }

    this.use(statics(this.root + '/theme/home/'));

    this.printChart();

    this.run(this.port);
  }

  // 使用koa的中间件
  use(middleware) {
    this.koacrab.use(convert(middleware));
  }

  errors() {
    // 监控错误日志
    let _this = this;
    let time = helps.formatDate('', 'yyyy-MM-dd hh:mm:ss');
    
    this.koacrab.on('error', function (err, ctx) {
      // debug('捕获error：' + err);
      console.log('捕获error：' + err.stack)
      // 在这里处理异常数据
      ctx.status = 200;
      ctx.body = err.message;

      // 邮件提醒
      let errorEmail = _this.conf.errorEmail;
      errorEmail.subject = 'error提醒';
      errorEmail.html = `
      时间：${time}<br />
      异常：${err.stack}<br/>
      `;
      helps.sendMail(errorEmail);
    });

    // 捕获promise reject错误
    process.on('unhandledRejection', function (reason, promise) {
      // 邮件提醒
      let errorEmail = _this.conf.errorEmail;
      errorEmail.subject = 'promise reject提醒';
      errorEmail.html = `
      时间：${time}<br />
      异常：${reason}<br/>
      `;
      helps.sendMail(errorEmail);
      debug('unhandledRejection异常：', reason);
    });

    // 捕获未知错误
    process.on('uncaughtException', function (err) {
      debug(err)
      // 端口冲突处理
      if (err.message.indexOf(' EADDRINUSE ') > -1) {
        _this.port += 1;

        _this.printChart();
        _this.run(_this.port);
      } else {
        process.exit();
      }
    });

    // 捕捉中间件错误
    this.koacrab.use(async function (ctx, next) {
      try {
        await next();
      } catch (err) {
        // debug('中间件错误：' + err);
        // throw err;
        ctx.app.emit('error', err, ctx);
      }
    });
  }

  // 运行
  run(...args) {
    this.koacrab.listen(...args);

    console.log((process.env.KOACRAB_ENV || 'default') + ': app running on port ' + args[0]);
  }

  // 注册中间件
  regMiddleware(middleware) {
    this.middlewares.push(middleware);
  }

  // 注册中间件
  regExtend(name, ext) {
    this.ext[name] = ext(koacrab);
    koacrab.ext = this.ext;
  }

  // 读取配置
  getConf(name) {
    return this.conf[name];
  }

  // 设置配置
  setConf(name, value) {
    return this.conf[name] = value;
  }

  // 输出字符
  printChart() {
    let str = `
  ***************************************************************
  *                                                             *
  *    _  __                    ___                    _        *
  *   | |/ /    ___    __ _    / __|     _ _   __ _   | |__     *
  *   | ' <    / _ \\  / _' |  | (__     | '_| / _' |  | '_ \\    *
  *   |_|\\_\\   \\___/  \\__,_|   \\___|   _|_|_  \\__,_|  |_.__/    *
  *  _|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|_|"""""|   *
  *  "'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'"'-0-0-'   *
  *                                                             *
  *                                                             *
  ***************************************************************
    `;
    console.log(color.green(str));
  }

  // 加载配置文件，默认是config.default.js
  loadConf(rootPath) {
    let dirs = rootPath + '/config/'
    let env = process.env.KOACRAB_ENV || 'default';

    let pathArr = ['default'];
    if (env) {
      pathArr.push(env);
    }

    let content = {};
    for (let i = 0; i < pathArr.length; i++) {
      let fileName = pathArr[i];
      let filePath = dirs + `config.${fileName}.js`;

      if (fs.existsSync(filePath)) {
        let tempObj = require(filePath);
        content = Object.assign(content, tempObj);
      }
    }

    return content;
  }
};
