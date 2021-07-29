'use strict';

const debug = require('debug')('koacrab-ws')
const http = require('http')
const process = require('process')
const WebSocket = require('ws')
const serversPatched = new WeakSet()

module.exports = function websocket () {
  let propertyName = 'ws'
  let options = undefined;
  if (!options) options = {}
  if (options instanceof http.Server) options = { server: options }

  if (parseInt(process.versions.node) < 10 && !options.noServerWorkaround) { // node 9 or earlier needs a workaround for upgrade requests
    if (!options.server) {
      throw new TypeError(`
        If you target Node 9 or earlier you must provide the HTTP server either as an option or as the second parameter.
        See the readme for more instructions
      `.trim().split('\n').map(s => s.trim()).join('\n'))
    } else {
      if (!serversPatched.has(options.server)) {
        serversPatched.add(options.server)
        options.server.on('upgrade', req => options.server.emit('request', req, new http.ServerResponse(req)))
        debug('added workaround to a server')
      }
    }
  }

  debug(`websocket middleware created with property name '${propertyName}'`)
  const wss = new WebSocket.Server({ noServer: true })

  const websocketServer = async (ctx, next) => {
    debug(`websocket middleware called on route ${ctx.path}`)
    const upgradeHeader = (ctx.request.headers.upgrade || '').split(',').map(s => s.trim())

    wss.once('connection', function connection(ws, request, client) {
      console.log('websock连接成功：'+ request.header.host + request.url);
      // wss.removeListener('connection');
      // wss.off('connection')
    });

    if (~upgradeHeader.indexOf('websocket')) {
      debug(`websocket middleware in use on route ${ctx.path}`)
      ctx[propertyName] = () => new Promise((resolve) => {
        wss.handleUpgrade(ctx.req, ctx.request.socket, Buffer.alloc(0), resolve)
        ctx.respond = false
        wss.emit('connection', resolve, ctx.request);
      })
    }

    await next()
  }

  websocketServer.server = wss
  return websocketServer
}



