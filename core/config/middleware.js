module.exports = {
  // 异步上下文
  'context': {
    status: true,
  },
  //favicon设置
  'favicon': {
    status: true,
  },

  //static
  'static': {
    status: true
  },

  //config
  'config': {
    status: true,
  },

  //bodyParser
  'bodyParser': {
    status: true,
  },

  //代理
  'proxy': {
    status: true,
  },

  //websocket
  'websocket': {
    status: false,
  },

  //websocket
  'cookie': {
    status: true,
  },

  //控制器
  'controllers': {
    status: true,
  },

  //模型
  'models': {
    status: true,
  },

  //services
  'services': {
    status: true,
  },

  //view
  'view': {
    status: true,
  },

  //日志
  'logger': {
    status: false,
  },

  //cors
  'cors': {
    status: true,
  },

  //session
  'session': {
    status: false,
  },

  //redis
  'redis': {
    status: false,
  },

  //skip middleware
  'skip': {
    status: false,
  },

  //http middleware
  'http': {
    status: true,
  },

  //router，要放到最后
  'router': {
    status: true,
  },
};
