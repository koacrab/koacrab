'use strict';

const debug = require('debug')('koacrab:wss')
const config = require('../config/index.js');
const io = require('socket.io')(config.wss.port || '');

module.exports = function wss(app) {
  app['socketList'] = {};

  // 在线用户
  let onlineUser = {};

  io.on('connection', function (socket) {
    //监听用户加入
    socket.on('login', function (obj) {
      socket.name = obj.token;
      // 将新加入用户的唯一标识当作socket的名称，后面退出的时候会用到
      socket.name = obj.token;

      //检查在线列表，如果不在里面就加入
      if (!onlineUser.hasOwnProperty(obj.token)) {
        onlineUser[obj.token] = obj.username;

        app['socketList'][socket.name] = socket;
      }

      let data = {msg: '服务器连接成功', error: 0};

      socket.emit('login', data)

      // console.log(obj.token + '加入了聊天室');
    });

    // 监听用户退出
    socket.on('disconnect', function () {
      // console.log('触发了disconnect');
      // 将退出的用户从在线列表中删除
      if (onlineUser.hasOwnProperty(socket.name)) {
        // 删除
        delete onlineUser[socket.name];  //socket.name=obj.token
        delete app['socketList'][socket.name];

      }
    });
  });

  return true;
};
