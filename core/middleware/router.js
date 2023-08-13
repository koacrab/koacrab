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

    // 如果链接没有?，则query会是null
    let params = ctx.request.query;

    // 处理如果传递两个相同参数的情况，使用最后一个
    for (let i in params) {
      if (helps.isArray(params[i])) {
        params[i] = params[i][params[i].length - 1];
      }
    }

    let mod = params.mod || 'index';
    let ctr = params.ctr || 'index';
    let act = params.act || 'index';

    delete (params['mod']);
    delete (params['ctr']);
    delete (params['act']);

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
