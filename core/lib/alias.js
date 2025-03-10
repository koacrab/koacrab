const Module = require('module');
const path = require('path');

/**
 * 路径别名插件
 * @param {Object} options 配置选项
 * @param {Object} options.aliases 别名映射
 */
function aliasPlugin(options = {}) {
  const { aliases = {} } = options;

  // 保存原始的 _resolveFilename 方法
  const originalResolveFilename = Module._resolveFilename;

  // 覆盖 _resolveFilename 方法
  Module._resolveFilename = function (request, parent) {
    // 跳过 node_modules 目录
    if (!request.includes('node_modules')) {
      // 检查是否有别名匹配
      for (const [alias, aliasPath] of Object.entries(aliases)) {
        if (request.startsWith(alias + '/')) {
          // 将别名路径替换为实际路径
          const relativePath = request.slice(alias.length + 1);
          request = path.join(aliasPath, relativePath);
          break;
        }
      }
    }

    // 调用原始的 _resolveFilename 方法
    return originalResolveFilename.call(this, request, parent);
  };
}

module.exports = aliasPlugin;