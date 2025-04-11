'use strict'
const helps = require('../tools/utils');
const debug = require('debug')('koacrab:router');

/**
 * 路由中间件
 * restful
 *
 */
module.exports = function () {
  return async function router(ctx, next) {
    if (ctx.url === '/favicon.ico') {
      return false;
    }

    let params = {};
    let mod = 'index';
    let ctr = 'index';
    let act = 'index';

    // 判断URL中是否包含?
    if (ctx.url.includes('?')) {
      // 使用原有的query参数解析方式
      params = ctx.request.query;

      // 处理如果传递两个相同参数的情况，使用最后一个
      for (let i in params) {
        if (helps.isArray(params[i])) {
          params[i] = params[i][params[i].length - 1];
        }
      }

      mod = params.mod || 'index';
      ctr = params.ctr || 'index';
      act = params.act || 'index';

      delete params['mod'];
      delete params['ctr'];
      delete params['act'];
    } else {
      // 使用新的RESTful路由格式
      let pathParts = ctx.path.split('/').filter(part => part !== '');
      
      // 提取模型、控制器和方法
      if (pathParts.length >= 1) mod = pathParts[0];
      if (pathParts.length >= 2) ctr = pathParts[1];
      if (pathParts.length >= 3) act = pathParts[2];

      // 处理剩余的参数键值对，包括空参数值的情况
      let rawParts = ctx.path.split('/');
      for (let i = 4; i < rawParts.length; i += 2) {
        // 如果是参数名
        if (i % 2 === 0) {
          let paramName = rawParts[i];
          if (paramName) {
            // 下一个位置是参数值，如果不存在或为空则设为空字符串
            let paramValue = (i + 1 < rawParts.length && rawParts[i + 1]) ? rawParts[i + 1] : '';
            params[paramName] = paramValue;
          }
        }
      }

      ctx.request.query = params;
    }

    ctx.router = {
      mod: mod,
      ctr: ctr,
      act: act,
      parm: params
    };

    global.koacrab['router'] = ctx.router;
    global.koacrab['params'] = params || {};

    // act的第一个是为_，则是私有方法，不能直接访问
    if (!helps.checkAct(act)) {
      debug('不能直接访问私有方法：' + act);
      ctx.body = '不能直接访问私有方法：' + act;
      return;
    }

    let modAndCtr = mod + '/' + ctr;

    let ctrs = Object.keys(ctx.controller);

    if (ctrs.indexOf(modAndCtr) === -1) {
      debug('模块或者控制器' + modAndCtr + '不存在，请检查');
      ctx.body = '请求的链接地址不存在，请检测！';
      return;
    }

    let ctrsFn = Object.getOwnPropertyNames(ctx.controller[modAndCtr].prototype);

    if (ctrsFn.indexOf(act) === -1) {
      debug(act + '方法不存在，请检查');
      ctx.body = act + '方法不存在，请检查';
      return;
    }

    // try {
    // 实例化控制器
    let temp = {};
    temp = new ctx.controller[modAndCtr](ctx);

    let obj = Object.assign(temp, ctx);
	
	// 前置控制器
    if (ctrsFn.indexOf('_before_') !== -1) {
      await temp['_before_'].call(obj);
    }

    // 前置单个
    if (ctrsFn.indexOf('_before_' + act) !== -1) {
      await temp['_before_' + act].call(obj);
    }

    // 正常操作
    ctx.actFn = temp[act];
    await ctx.actFn.call(obj);

    // 后置单个
    if (ctrsFn.indexOf('_after_' + act) !== -1) {
      await temp['_after_' + act].call(obj);
    }
	
	// 后置控制器
    if (ctrsFn.indexOf('_after_') !== -1) {
      await temp['_after_'].call(obj);
    }

    // } catch (err) {
    // debug(err);
    // console.log('路由异常……')
    // ctx.body = '出现异常！请检测！' + err;
    // }

    await next();
  }
}
