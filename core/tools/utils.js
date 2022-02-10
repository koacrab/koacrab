'use strict';

const net = require('net');
const fs = require('fs');
const path = require('path');
const {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  isBuffer
} = require('core-util-is');

const isIP = net.isIP;
const isIPv4 = net.isIPv4;
const isIPv6 = net.isIPv6;

module.exports = {
  isArray,
  isBoolean,
  isNull,
  isNullOrUndefined,
  isNumber,
  isString,
  isSymbol,
  isUndefined,
  isRegExp,
  isObject,
  isDate,
  isError,
  isFunction,
  isPrimitive,
  isBuffer,
  isIP,
  isIPv4,
  isIPv6,
  // 检测控制器是否为私有
  checkAct: function(name){
    if(name && name.substr(0, 1) === '_'){
      return false;
    }

    return true;
  },

  readDirSync: function(dir, type){
    let children = {};

    let read = function(dir, type){
      fs.readdirSync(dir).forEach(function(filename) {
        let filePath = dir + "/" + filename;
        let stat = fs.statSync(filePath);
        let tempObj = {};

        if (stat && stat.isDirectory()) {
          read(filePath, filename);
        } else {
          let baseName = '';
          if (type) {
            baseName = type + '/' + path.basename(filename, '.js');
          } else {
            baseName = path.basename(filename, '.js');
          }

          tempObj[baseName] = filePath;
          Object.assign(children, tempObj);
        }
      });

      return children;

    }

    read(dir, type)
  },

  log (log, type = 'log') {
    if (typeof log === 'string') {
        console[type](`[${new Date()}] [koacrab] ${log}`);
    } else {
        const msg = log.stack || log.toString();
        console[type]();
        console[type](msg);
        console[type]();
    }
  }
};


