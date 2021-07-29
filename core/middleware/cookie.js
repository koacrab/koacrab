function encode(obj) {
  return new Buffer(obj).toString("base64");
}

function decode(objstr) {
  let session = new Buffer(objstr, "base64").toString();
  return JSON.parse(session);
}

function getExpTime(day) {
  let exp = new Date();
  exp.setTime(exp.getTime() + (day * 1000 * 60 * 60 * 24));
  return exp.toGMTString();
}

module.exports =  function (opts = {}) {
  opts.key = opts.key || 'koacrab:sid';

  return async function (ctx, next) {
    let sessionID = opts.key;
    let sessionObject = decode(ctx.cookies.get(sessionID, {
    }) || encode('{}'));
    ctx.session = sessionObject;
    await next();
    if (ctx.session === null) {
      ctx.cookies.set(sessionID, '', {
        expires: new Date(getExpTime(-1))
      });
    } else {
      ctx.cookies.set(sessionID, encode(JSON.stringify(ctx.session)), {
        expires: new Date(getExpTime(opts.expires || 7)),
        path: opts.path || '/'
      });
    }
  }
}
